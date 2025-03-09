import { Link } from 'react-router-dom'

function Logo() {
    return (
        <Link to="/">
            <h1 className="text-md font-semibold">RSTORE</h1>
        </Link>
    )
}

export default Logo