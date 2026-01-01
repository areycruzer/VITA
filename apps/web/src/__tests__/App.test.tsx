import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../app/page'

// Mock the ConnectButton to avoid Context issues
jest.mock('../components/ConnectButton', () => ({
    ConnectButton: () => <button>Mock Connect</button>
}))

describe('Home Page', () => {
    it('renders the VITA Protocol header', () => {
        render(<Home />)

        // Check for VITA text (returns multiple)
        const headings = screen.getAllByText(/VITA/i)
        expect(headings.length).toBeGreaterThan(0)
        expect(headings[0]).toBeInTheDocument()

        // Check for main CTA
        const button = screen.getAllByText(/Start Tokenizing/i)[0]
        expect(button).toBeInTheDocument()

        // Check for Mock Connect
        expect(screen.getByText('Mock Connect')).toBeInTheDocument()
    })
})
