import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('renders nothing when totalPages <= 1', () => {
    const { container } = render(
      <Pagination total={5} page={0} perPage={10} onPageChange={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows correct range text', () => {
    render(
      <Pagination total={25} page={0} perPage={10} onPageChange={() => {}} />
    )
    expect(screen.getByText(/Showing 1/)).toBeInTheDocument()
    expect(screen.getByText(/of 25/)).toBeInTheDocument()
  })

  it('calls onPageChange when clicking next', () => {
    const onChange = vi.fn()
    render(
      <Pagination total={25} page={0} perPage={10} onPageChange={onChange} />
    )
    const buttons = screen.getAllByRole('button')
    // Next button is the second one
    fireEvent.click(buttons[1])
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('disables prev button on first page', () => {
    render(
      <Pagination total={25} page={0} perPage={10} onPageChange={() => {}} />
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <Pagination total={25} page={2} perPage={10} onPageChange={() => {}} />
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons[1]).toBeDisabled()
  })
})
