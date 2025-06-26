import type { Card } from '@schoolletloose/shared';
import { CardType, ManaCost } from '@schoolletloose/shared';
import { clsx } from 'clsx';

interface CardProps {
  card: Card;
  className?: string;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onPlay?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function Card({ 
  card, 
  className, 
  isPlayable = false, 
  isSelected = false, 
  onClick, 
  onPlay,
  size = 'medium' 
}: CardProps) {
  const cardTypeStyles = {
    [CardType.CREATURE]: 'border-l-green-500 bg-green-50/5',
    [CardType.SPELL]: 'border-l-red-500 bg-red-50/5',
    [CardType.ARTIFACT]: 'border-l-yellow-500 bg-yellow-50/5',
    [CardType.LAND]: 'border-l-amber-600 bg-amber-50/5',
  };

  const sizeStyles = {
    small: 'w-20 h-28 text-xs',
    medium: 'w-32 h-44 text-sm',
    large: 'w-48 h-64 text-base'
  };

  return (
    <div
      className={clsx(
        'card-base cursor-pointer transition-all duration-300',
        cardTypeStyles[card.type],
        sizeStyles[size],
        {
          'card-glow ring-2 ring-blue-400': isSelected,
          'hover:shadow-card-hover hover:-translate-y-1': isPlayable,
          'opacity-60 cursor-not-allowed': !isPlayable && onClick,
        },
        className
      )}
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate flex-1 mr-1">
            {card.name}
          </h3>
          <ManaCostDisplay cost={card.manaCost} size={size} />
        </div>
      </div>

      {/* Card Art */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
        {card.artworkUrl ? (
          <img
            src={card.artworkUrl}
            alt={card.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-2xl mb-1">🎴</div>
              <div className="text-xs">No Art</div>
            </div>
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {card.type}
        </div>
      </div>

      {/* Card Stats (for creatures) */}
      {card.type === CardType.CREATURE && (
        <div className="flex justify-between items-center px-2 py-1 bg-gray-100 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs font-medium">
            <span className="text-red-600">{card.attack || 0}</span>
            <span className="text-gray-400">/</span>
            <span className="text-blue-600">{card.defense || 0}</span>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="p-2 border-t border-gray-200">
        <p className="text-xs text-gray-600 line-clamp-2">
          {card.description}
        </p>
        
        {/* Effects Preview */}
        {card.effects && card.effects.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {card.effects.slice(0, 2).map((effect, index) => (
              <span
                key={index}
                className="inline-block bg-purple-100 text-purple-800 text-xs px-1 py-0.5 rounded"
              >
                {effect.name}
              </span>
            ))}
            {card.effects.length > 2 && (
              <span className="text-xs text-gray-400">
                +{card.effects.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Play Button (when playable) */}
      {isPlayable && onPlay && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="absolute inset-0 bg-green-500/90 text-white font-medium opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
        >
          Play Card
        </button>
      )}
    </div>
  );
}

interface ManaCostDisplayProps {
  cost: ManaCost;
  size?: 'small' | 'medium' | 'large';
}

function ManaCostDisplay({ cost, size = 'medium' }: ManaCostDisplayProps) {
  const symbolSize = {
    small: 'w-3 h-3 text-xs',
    medium: 'w-4 h-4 text-xs',
    large: 'w-5 h-5 text-sm'
  };

  const symbols = [];
  
  // Add colored mana symbols
  if (cost.math) {
    for (let i = 0; i < cost.math; i++) {
      symbols.push(
        <div key={`math-${i}`} className={clsx('mana-symbol mana-math', symbolSize[size])}>
          M
        </div>
      );
    }
  }
  
  if (cost.german) {
    for (let i = 0; i < cost.german; i++) {
      symbols.push(
        <div key={`german-${i}`} className={clsx('mana-symbol mana-german', symbolSize[size])}>
          G
        </div>
      );
    }
  }
  
  if (cost.english) {
    for (let i = 0; i < cost.english; i++) {
      symbols.push(
        <div key={`english-${i}`} className={clsx('mana-symbol mana-english', symbolSize[size])}>
          E
        </div>
      );
    }
  }
  
  if (cost.french) {
    for (let i = 0; i < cost.french; i++) {
      symbols.push(
        <div key={`french-${i}`} className={clsx('mana-symbol mana-french', symbolSize[size])}>
          F
        </div>
      );
    }
  }
  
  if (cost.latin) {
    for (let i = 0; i < cost.latin; i++) {
      symbols.push(
        <div key={`latin-${i}`} className={clsx('mana-symbol mana-latin', symbolSize[size])}>
          L
        </div>
      );
    }
  }
  
  if (cost.differentiation) {
    for (let i = 0; i < cost.differentiation; i++) {
      symbols.push(
        <div key={`differentiation-${i}`} className={clsx('mana-symbol mana-differentiation', symbolSize[size])}>
          D
        </div>
      );
    }
  }
  
  // Add learning mana
  if (cost.learning) {
    symbols.push(
      <div key="learning" className={clsx('mana-symbol mana-learning', symbolSize[size])}>
        {cost.learning}
      </div>
    );
  }

  if (symbols.length === 0) {
    symbols.push(
      <div key="free" className={clsx('mana-symbol mana-colorless', symbolSize[size])}>
        0
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-0.5">
      {symbols}
    </div>
  );
}
