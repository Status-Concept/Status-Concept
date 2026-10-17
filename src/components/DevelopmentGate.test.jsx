import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import DevelopmentGate from './DevelopmentGate'

beforeEach(() => window.sessionStorage.clear())
afterEach(() => cleanup())

const mount = () => render(<DevelopmentGate><div>Website content</div></DevelopmentGate>)

describe('development preview gate', () => {
  it('hides the site until credentials are entered', () => {
    mount()
    expect(screen.getByRole('heading', { name: 'Site under development' })).toBeTruthy()
    expect(screen.queryByText('Website content')).toBeNull()
  })

  it('rejects incorrect credentials without storing the password', () => {
    mount()
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'status' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enter site' }))
    expect(screen.getByRole('alert').textContent).toBe('Incorrect username or password.')
    expect(screen.queryByText('Website content')).toBeNull()
    expect(window.sessionStorage.length).toBe(0)
  })

  it('accepts the requested credentials for this browser tab', () => {
    mount()
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'status' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'status123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enter site' }))
    expect(screen.getByText('Website content')).toBeTruthy()
    expect(window.sessionStorage.getItem('statvs-development-access')).toBe('granted')
    expect(JSON.stringify(window.sessionStorage)).not.toContain('status123')
  })
})
