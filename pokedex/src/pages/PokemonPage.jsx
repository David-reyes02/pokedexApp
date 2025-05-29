import React, { useContext, useEffect, useState } from 'react'
import { PokemonContext } from '../context/PokemonContext'
import { Loader } from '../components'
import { primerMayuscula } from '../helper/helper'
import { useParams } from 'react-router-dom';

export const PokemonPage = () => {
    const { getPokemonByID } = useContext(PokemonContext)

    const [loading, setLoading] = useState(true)
    const [pokemon, setPokemon] = useState({})

    const { id } = useParams()

    const fetchPokemon = async (id) => {
        const data = await getPokemonByID(id)
        setPokemon(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchPokemon(id)
    }, [id])

    return (
        <main className='container main-pokemon'>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className='header-main-pokemon'>
                        <span className='number-pokemon'>#{pokemon.id}</span>
                        <div className='container-img-pokemon'>
                            <img
                                src={pokemon.sprites.other.dream_world.front_default}
                                alt={`Pokemon ${pokemon?.name}`}
                            />
                        </div>

                        <div className='container-info-pokemon'>
                            <h1>{primerMayuscula(pokemon.name)}</h1>
                            <div className='card-types info-pokemon-type'>
                                {pokemon.types.map(type => (
                                    <span key={type.type.name} className={`${type.type.name}`}>
                                        {type.type.name}
                                    </span>
                                ))}
                            </div>
                            <div className='info-pokemon'>
                                <div className='group-info'>
                                    <p>Altura</p>
                                    <span>{pokemon.height}</span>
                                </div>
                                <div className='group-info'>
                                    <p>Peso</p>
                                    <span>{pokemon.weight}KG</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='container-stats'>
                        <h1>Estadísticas</h1>
                        <div className='stats'>
                            {pokemon.stats.map((stat, index) => {
                                // Mapeo para poner nombres legibles y clases de color por tipo de stat
                                const statNames = [
                                    'Hp',
                                    'Attack',
                                    'Defense',
                                    'Special Attack',
                                    'Special Defense',
                                    'Speed',
                                ]
                                const classColor = statNames[index].toLowerCase().replace(' ', '-')

                                return (
                                    <div className='stat-group' key={index}>
                                        <span>{statNames[index]}</span>
                                        <div className="progress-bar-container">
                                            <div
                                                className={`progress-bar ${classColor}`}
                                                style={{ width: `${stat.base_stat}%` }}
                                            ></div>
                                        </div>
                                        <span className='counter-stat'>{stat.base_stat}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </main>
    )
}
