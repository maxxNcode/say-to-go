import { describe, it, expect, beforeEach, vi } from 'vitest'

const store = new Map<string, string>()
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, val: string) => store.set(key, val),
  removeItem: (key: string) => store.delete(key),
})

import { saveSearch, getHistory } from '../history'

describe('history', () => {
  beforeEach(() => {
    store.clear()
  })

  it('saves a search term', () => {
    saveSearch('Paris')
    const history = getHistory()
    expect(history).toHaveLength(1)
    expect(history[0]).toBe('Paris')
  })

  it('deduplicates by term', () => {
    saveSearch('Paris')
    saveSearch('London')
    saveSearch('Paris')
    const history = getHistory()
    expect(history).toHaveLength(2)
    expect(history[0]).toBe('Paris')
  })

  it('caps at 8 entries', () => {
    for (let i = 0; i < 10; i++) {
      saveSearch(`Place ${i}`)
    }
    expect(getHistory()).toHaveLength(8)
  })

  it('returns empty array when nothing stored', () => {
    expect(getHistory()).toEqual([])
  })

  it('handles corrupt localStorage', () => {
    store.set('stg_history', 'not-json')
    expect(getHistory()).toEqual([])
  })
})
