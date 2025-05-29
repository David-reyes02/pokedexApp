import { useEffect, useState } from "react";
import { PokemonContext } from "./PokemonContext";
import { useForm } from "../hook/useForm";

// Función para eliminar duplicados por ID
const eliminarDuplicados = (array) => {
  const mapa = new Map();
  array.forEach(pokemon => {
    mapa.set(pokemon.id, pokemon);
  });
  return [...mapa.values()];
};

export const PokemonProvider = ({ children }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);

  // Guarda qué tipos están seleccionados
  const [typeSelected, setTypeSelected] = useState({});

  // Lista filtrada según tipos seleccionados
  const [filteredPokemons, setFilteredPokemons] = useState([]);

  const { valueSearch, onInputChange, onResetForm } = useForm({
    valueSearch: '',
  });

  const getAllPokemons = async (limit = 50) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data = await res.json();

      const promises = data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const data = await res.json();
        return data;
      });

      const results = await Promise.all(promises);
      const nuevos = eliminarDuplicados([...allPokemons, ...results]);
      setAllPokemons(nuevos);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching allPokemons:', error);
    }
  };

  const getGlobalPokemons = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=250&offset=0`);
      const data = await res.json();

      const promises = data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const data = await res.json();
        return data;
      });

      const results = await Promise.all(promises);
      const sinDuplicados = eliminarDuplicados(results);
      setGlobalPokemons(sinDuplicados);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching globalPokemons:', error);
    }
  };

  const getPokemonByID = async (id) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching pokemon by ID:', error);
      return null;
    }
  };

  // Se llama cuando cambia el offset para cargar más pokemons
  useEffect(() => {
    getAllPokemons();
  }, [offset]);

  // Solo una vez al montar el componente
  useEffect(() => {
    getGlobalPokemons();
  }, []);

  // Función para manejar checkbox y filtrar pokemons por tipo
  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    // Actualiza el estado del filtro por tipo
    const nuevosTipos = {
      ...typeSelected,
      [name]: checked,
    };
    setTypeSelected(nuevosTipos);

    // Filtra pokemons que tienen alguno de los tipos seleccionados
    const tiposSeleccionados = Object.entries(nuevosTipos)
      .filter(([tipo, estaSeleccionado]) => estaSeleccionado)
      .map(([tipo]) => tipo);

    if (tiposSeleccionados.length === 0) {
      // Si no hay tipos seleccionados, mostrar todos
      setFilteredPokemons([]);
      return;
    }

    // Filtra globalPokemons según los tipos seleccionados
    const filtrados = globalPokemons.filter(pokemon =>
      pokemon.types.some(t => tiposSeleccionados.includes(t.type.name))
    );

    setFilteredPokemons(eliminarDuplicados(filtrados));
  };

  // Carga más pokemons incrementando offset
  const onClickLoadMore = () => {
    setOffset(prev => prev + 50);
  };

  return (
    <PokemonContext.Provider
      value={{
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        globalPokemons,
        getPokemonByID,
        loading,
        setLoading,
        active,
        setActive,
        handleCheckbox,
        filteredPokemons,
        onClickLoadMore,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
