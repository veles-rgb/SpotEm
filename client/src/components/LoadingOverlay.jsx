export default function LoadingOverlay({
  message = 'Loading...',
  fullscreen = false,
}) {
  return (
    <div
      style={{
        position: fullscreen ? 'fixed' : 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 9999,
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <div
        style={{
          background: 'white',
          padding: '18px 22px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minWidth: 200,
          justifyContent: 'center',
          color: 'black',
        }}
      >
        <div className="spinner" />
        <span>{message}</span>
      </div>
    </div>
  );
}
