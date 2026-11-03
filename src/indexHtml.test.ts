import html from '../index.html?raw'

describe('index.html', () => {
  it('resizes layout for the on-screen keyboard so the docked form stays visible', () => {
    const viewport =
      html.match(/name="viewport"\s+content="([^"]+)"/)?.[1] ?? ''
    expect(viewport).toContain('interactive-widget=resizes-content')
  })
})
