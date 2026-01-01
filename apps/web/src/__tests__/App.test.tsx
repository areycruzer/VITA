import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom' // Ensure matchers are available
import Home from '../app/page'

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
    })

    it('renders stats section', () => {
        render(<Home />)

        expect(screen.getByText(/Total Value Locked/i)).toBeInTheDocument()
        expect(screen.getByText(/Workers Tokenized/i)).toBeInTheDocument()
    })
})
