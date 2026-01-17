import React, { useState } from 'react';

const Logo = ({ className = "w-10 h-10" }) => {
  const [error, setError] = useState(false);

  // Fallback styling (Original "J")
  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform`}>
        J
      </div>
    );
  }

  // Affiche le logo (inverti en blanc pour le thème sombre)
  // Assurez-vous que l'image est un PNG avec fond transparent !
  return (
    <img 
      src="/logo.png" 
      alt="Jordan Fausta" 
      className={`${className} object-contain brightness-0 invert`} 
      onError={() => setError(true)}
    />
  );
};

export default Logo;
