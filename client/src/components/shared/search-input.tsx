import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Input } from '../ui/input'

function SearchInput() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState<string>(searchParams.get('search') || '');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (search === '') {
            searchParams.delete('search')
        } else {
            searchParams.set('search', search)
        }
        searchParams.delete('page')
        setSearchParams(searchParams)
    }
    return (
        <form onSubmit={handleSearch}>
            <Input
                placeholder="Search"
                value={search}
                className='w-72'
                onChange={(e) => setSearch(e.target.value)}
            />
        </form>
    )
}

export default SearchInput