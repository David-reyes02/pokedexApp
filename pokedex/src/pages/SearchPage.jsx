import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { PokemonContext } from '../context/PokemonContext';
import { CardPokemon } from '../components/CardPokemon'; // ✅ asegurate que el path sea correcto

export const SearchPage = () => {
  const location = useLocation();
  const { globalPokemons } = useContext(PokemonContext); // ✅ uso correcto del contexto

  const searchTerm = location.state?.toLowerCase?.() || ''; // ✅ defensivo

  if (!globalPokemons) return <p>Cargando pokémons...</p>;

  const filteredPokemons = globalPokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className='container'>
      <p className='p-search'>
        Se encontraron <span>{filteredPokemons.length}</span> resultados:
      </p>
      <div className='card-list-pokemon container'>
        {filteredPokemons.map(pokemon => (
          <CardPokemon pokemon={pokemon} key={pokemon.id} />
        ))}
      </div>
    </div>
  );
};
