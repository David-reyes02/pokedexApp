import React, { useContext } from 'react';
import { PokemonContext } from '../context/PokemonContext';
import { CardPokemon } from './CardPokemon';
import { Loader } from './Loader';

export const PokemonList = () => {
	const {
		allPokemons,
		loading,
		filteredPokemons,
		onClickLoadMore,
	} = useContext(PokemonContext);

	// Elegir qué lista mostrar
	const pokemonsToRender = filteredPokemons.length > 0 ? filteredPokemons : allPokemons;

	// Mostrar botón solo si no hay filtros activos
	const showLoadMore = filteredPokemons.length === 0;

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className='card-list-pokemon container'>
						{pokemonsToRender.map(pokemon => (
							<CardPokemon pokemon={pokemon} key={pokemon.id} />
						))}
					</div>

					{showLoadMore && (
						<div className='container-btn-load-more'>
							<button className='btn-load-more' onClick={onClickLoadMore}>
								Cargar más
							</button>
						</div>
					)}
				</>
			)}
		</>
	);
};
