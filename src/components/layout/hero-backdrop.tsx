import clsx from 'clsx'

export const HeroBackdrop = () => {
  return (
    <div
      className={clsx('z-10 w-screen absolute h-screen bg-no-repeat bg-cover')}
      style={{
        background:
          'radial-gradient(180deg, rgba(2, 2, 2, 0) 0%, #0c0c12 8.76%, #7573bc 100%)',
      }}
    />
  )
}
