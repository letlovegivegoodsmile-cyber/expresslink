export function Stars({ large = false }: { large?: boolean }) {
  const path =
    "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.2 5.8 20.9l1.6-7L2 9.2l7.1-.6z";
  return (
    <span className={`stars${large ? " stars-lg" : ""}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24">
          <path d={path} />
        </svg>
      ))}
    </span>
  );
}
