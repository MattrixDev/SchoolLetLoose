import { ManaPool as ManaPoolType, GAME_CONSTANTS } from '@magicschool/shared';
import { clsx } from 'clsx';

interface ManaPoolProps {
  manaPool: ManaPoolType;
  className?: string;
  onClick?: (color: keyof ManaPoolType) => void;
  size?: 'small' | 'medium' | 'large';
}

export function ManaPool({ manaPool, className, onClick, size = 'medium' }: ManaPoolProps) {
  const manaColors = GAME_CONSTANTS.MANA_COLORS;

  return (
    <div className={clsx('flex items-center space-x-2', className)}>
      {manaColors.map((color) => (
        <ManaOrb
          key={color}
          color={color}
          amount={manaPool[color]}
          size={size}
          onClick={onClick ? () => onClick(color) : undefined}
        />
      ))}
    </div>
  );
}

interface ManaOrbProps {
  color: keyof ManaPoolType;
  amount: number;
  size: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

function ManaOrb({ color, amount, size, onClick }: ManaOrbProps) {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-lg',
    large: 'w-16 h-16 text-xl'
  };

  const colorClasses = {
    math: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/50',
    german: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/50',
    english: 'bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-gray-800/50',
    french: 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/50',
    latin: 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-green-400/50',
    differentiation: 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-gray-800 shadow-yellow-400/50',
    learning: 'bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-gray-400/50'
  };

  const subjectIcons = {
    math: '📊', // Math
    german: '🇩🇪', // German
    english: '📚', // English
    french: '🇫�', // French
    latin: '🏛️', // Latin
    differentiation: '⚖️', // Differentiation
    learning: '🎓' // Learning
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <div
        className={clsx(
          'rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-200',
          sizeClasses[size],
          colorClasses[color],
          {
            'cursor-pointer hover:scale-110 hover:shadow-xl': onClick,
            'opacity-50': amount === 0
          }
        )}
        onClick={onClick}
        title={`${GAME_CONSTANTS.SUBJECT_MAPPINGS[color]} Mana: ${amount}`}
      >
        <div className="flex flex-col items-center">
          <div className="text-xs opacity-80">{subjectIcons[color]}</div>
          <div className="font-bold">{amount}</div>
        </div>
      </div>
      <div className="text-xs text-gray-400 text-center">
        {GAME_CONSTANTS.SUBJECT_MAPPINGS[color]}
      </div>
    </div>
  );
}

interface ManaCounterProps {
  manaPool: ManaPoolType;
  className?: string;
}

export function ManaCounter({ manaPool, className }: ManaCounterProps) {
  const totalMana = Object.values(manaPool).reduce((sum, mana) => sum + mana, 0);

  return (
    <div className={clsx('bg-slate-800 rounded-lg p-3 border border-slate-600', className)}>
      <div className="text-center mb-2">
        <div className="text-lg font-bold text-white">{totalMana}</div>
        <div className="text-xs text-gray-400">Total Mana</div>
      </div>
      
      <div className="grid grid-cols-4 gap-1">
        {GAME_CONSTANTS.MANA_COLORS.map((color) => (
          <div key={color} className="text-center">
            <div className={clsx(
              'w-6 h-6 rounded text-xs font-bold flex items-center justify-center mx-auto mb-1',
              {
                'bg-blue-500 text-white': color === 'math',
                'bg-red-500 text-white': color === 'german',
                'bg-gray-800 text-white': color === 'english',
                'bg-green-500 text-white': color === 'french',
                'bg-green-400 text-white': color === 'latin',
                'bg-yellow-400 text-gray-800': color === 'differentiation',
                'bg-gray-400 text-white': color === 'learning'
              }
            )}>
              {manaPool[color]}
            </div>
            <div className="text-xs text-gray-400 capitalize">{color[0]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
