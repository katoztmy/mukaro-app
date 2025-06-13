"use client";

import React, { useEffect, useState } from 'react';

interface SeasonalAnimationsProps {
  season: 'spring' | 'summer' | 'autumn' | 'winter' | null;
}

export default function SeasonalAnimations({ season }: SeasonalAnimationsProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    animationDelay: number;
    animationDuration: number;
  }>>([]);

  useEffect(() => {
    if (!season) {
      setParticles([]);
      return;
    }

    // パーティクルを生成
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: 3 + Math.random() * 4,
    }));

    setParticles(newParticles);
  }, [season]);

  if (!season) return null;

  const getParticleContent = () => {
    switch (season) {
      case 'spring':
        return '🌸';
      case 'summer':
        return '🌊';
      case 'autumn':
        return '🍁';
      case 'winter':
        return '❄️';
      default:
        return '';
    }
  };

  const getBackgroundStyle = () => {
    switch (season) {
      case 'spring':
        return {
          background: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 50%, #F9FAFB 100%)',
        };
      case 'summer':
        return {
          background: 'linear-gradient(180deg, #DBEAFE 0%, #93C5FD 30%, #60A5FA 70%, #F9FAFB 100%)',
        };
      case 'autumn':
        return {
          background: 'linear-gradient(180deg, #FED7AA 0%, #FDBA74 30%, #FB923C 50%, #F9FAFB 100%)',
        };
      case 'winter':
        return {
          background: 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 30%, #9CA3AF 50%, #F9FAFB 100%)',
        };
      default:
        return { background: '#F9FAFB' };
    }
  };

  return (
    <>
      {/* 季節の背景 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          ...getBackgroundStyle(),
        }}
      />

      {/* パーティクルアニメーション */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              top: '-10px',
              fontSize: season === 'summer' ? '12px' : '16px',
              animation: `fall-${season} ${particle.animationDuration}s linear ${particle.animationDelay}s infinite`,
              opacity: 0.8,
            }}
          >
            {getParticleContent()}
          </div>
        ))}
      </div>

      {/* CSS アニメーション */}
      <style jsx>{`
        @keyframes fall-spring {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fall-summer {
          0% {
            transform: translateY(-10px) translateX(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(50vh) translateX(10px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(-5px);
            opacity: 0;
          }
        }

        @keyframes fall-autumn {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fall-winter {
          0% {
            transform: translateY(-10px) rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) scale(0.8);
            opacity: 0.9;
          }
          100% {
            transform: translateY(100vh) rotate(360deg) scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}