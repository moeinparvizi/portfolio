import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="universe">
      <!-- Stars Background -->
      <div class="stars" id="stars"></div>
      <div class="stars2" id="stars2"></div>
      <div class="stars3" id="stars3"></div>

      <!-- Shooting Stars -->
      <div class="shooting-star"></div>
      <div class="shooting-star shooting-star-2"></div>
      <div class="shooting-star shooting-star-3"></div>

      <!-- Nebula -->
      <div class="nebula"></div>
      <div class="nebula nebula-2"></div>

      <!-- Content -->
      <div class="content">
        <div class="glow-text">
          <h1 class="error-code">404</h1>
        </div>
        <p class="message">Lost in the cosmos?</p>
        <p class="sub-message">This page has drifted into a black hole.</p>
        <a routerLink="/en" class="home-btn">
          <span class="btn-text">Return to Earth</span>
          <span class="btn-icon">🚀</span>
        </a>
      </div>

      <!-- Floating Planets -->
      <div class="planet planet-1"></div>
      <div class="planet planet-2"></div>
      <div class="planet planet-3"></div>
    </div>
  `,
  styles: [`
    .universe {
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
    }

    /* Star Layers */
    .stars, .stars2, .stars3 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-repeat: repeat;
      background-size: cover;
    }

    .stars {
      background-image:
        radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
      background-repeat: repeat;
      background-size: 200px 200px;
      animation: sparkle 5s ease-in-out infinite;
      opacity: 0.8;
    }

    .stars2 {
      background-image:
        radial-gradient(1px 1px at 10px 50px, #fff, rgba(0,0,0,0)),
        radial-gradient(1px 1px at 80px 20px, #fff, rgba(0,0,0,0)),
        radial-gradient(1px 1px at 120px 90px, #fff, rgba(0,0,0,0)),
        radial-gradient(1px 1px at 150px 40px, #ddd, rgba(0,0,0,0)),
        radial-gradient(1px 1px at 180px 70px, #fff, rgba(0,0,0,0));
      background-repeat: repeat;
      background-size: 150px 150px;
      animation: sparkle 8s ease-in-out infinite reverse;
      opacity: 0.6;
    }

    .stars3 {
      background-image:
        radial-gradient(1px 1px at 30px 80px, #fff, rgba(0,0,0,0)),
        radial-gradient(1px 1px at 70px 120px, #ddd, rgba(0,0,0,0)),
        radial-gradient(1px 1px at 140px 30px, #fff, rgba(0,0,0,0)),
        radial-gradient(1px 1px at 190px 110px, #fff, rgba(0,0,0,0));
      background-repeat: repeat;
      background-size: 100px 100px;
      animation: sparkle 12s ease-in-out infinite;
      opacity: 0.4;
    }

    @keyframes sparkle {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    /* Shooting Stars */
    .shooting-star {
      position: absolute;
      width: 150px;
      height: 1px;
      background: linear-gradient(to right, rgba(255,255,255,0.8), transparent);
      transform: rotate(-45deg);
      animation: shoot 3s ease-in-out infinite;
      opacity: 0;
    }

    .shooting-star::before {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 10px 2px rgba(255,255,255,0.8);
      right: 0;
      top: -2px;
    }

    .shooting-star {
      top: 20%;
      left: 60%;
      animation-delay: 0s;
    }

    .shooting-star-2 {
      top: 40%;
      left: 80%;
      animation-delay: 1.5s;
      width: 100px;
    }

    .shooting-star-3 {
      top: 60%;
      left: 70%;
      animation-delay: 3s;
      width: 120px;
    }

    @keyframes shoot {
      0% { transform: rotate(-45deg) translateX(0); opacity: 0; }
      5% { opacity: 1; }
      15% { opacity: 0; }
      100% { transform: rotate(-45deg) translateX(-300px); opacity: 0; }
    }

    /* Nebula */
    .nebula {
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(ellipse, rgba(138, 43, 226, 0.15) 0%, transparent 70%);
      top: -10%;
      right: -10%;
      animation: nebulaPulse 10s ease-in-out infinite;
    }

    .nebula-2 {
      background: radial-gradient(ellipse, rgba(65, 105, 225, 0.12) 0%, transparent 70%);
      top: auto;
      right: auto;
      bottom: -15%;
      left: -10%;
      animation-delay: 5s;
    }

    @keyframes nebulaPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    /* Planets */
    .planet {
      position: absolute;
      border-radius: 50%;
    }

    .planet-1 {
      width: 60px;
      height: 60px;
      background: radial-gradient(circle at 30% 30%, #6B8DD6, #3B5998);
      top: 15%;
      right: 15%;
      box-shadow: inset -10px -10px 20px rgba(0,0,0,0.5), 0 0 30px rgba(107, 141, 214, 0.3);
      animation: float 6s ease-in-out infinite;
    }

    .planet-2 {
      width: 35px;
      height: 35px;
      background: radial-gradient(circle at 30% 30%, #E8A87C, #D35400);
      bottom: 20%;
      left: 10%;
      box-shadow: inset -5px -5px 15px rgba(0,0,0,0.5), 0 0 20px rgba(232, 168, 124, 0.3);
      animation: float 8s ease-in-out infinite reverse;
    }

    .planet-3 {
      width: 20px;
      height: 20px;
      background: radial-gradient(circle at 30% 30%, #A8E6CF, #3D9970);
      top: 70%;
      right: 20%;
      box-shadow: inset -3px -3px 8px rgba(0,0,0,0.5), 0 0 15px rgba(168, 230, 207, 0.3);
      animation: float 5s ease-in-out infinite;
      animation-delay: 2s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }

    /* Content */
    .content {
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 2rem;
    }

    .glow-text {
      position: relative;
      display: inline-block;
    }

    .error-code {
      font-size: 10rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      line-height: 1;
      text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
      animation: glow 3s ease-in-out infinite;
    }

    @keyframes glow {
      0%, 100% { filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5)); }
      50% { filter: drop-shadow(0 0 40px rgba(118, 75, 162, 0.8)); }
    }

    .message {
      font-size: 1.8rem;
      color: #E2E8F0;
      margin: 1.5rem 0 0.5rem;
      font-weight: 500;
    }

    .sub-message {
      font-size: 1rem;
      color: #94A3B8;
      margin: 0 0 2rem;
    }

    .home-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 50px;
      color: white;
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 500;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .home-btn:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .btn-icon {
      font-size: 1.3rem;
      animation: rocketBounce 2s ease-in-out infinite;
    }

    @keyframes rocketBounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-5px) rotate(5deg); }
    }

    @media (max-width: 768px) {
      .error-code {
        font-size: 6rem;
      }
      .message {
        font-size: 1.4rem;
      }
    }
  `],
})
export class NotFoundComponent {}
