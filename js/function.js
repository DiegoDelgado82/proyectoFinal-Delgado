function startAnimation() {
      const dotContainer = document.getElementById('dotContainer');
      dotContainer.style.visibility = 'visible';
      
      const dots = document.getElementsByClassName('dot');
      for (let i = 0; i < dots.length; i++) {
        dots[i].style.animationDelay = `${i * 0.2}s`;
      }
      
      setTimeout(() => {
        // Redirigir a la próxima página
        window.location.href = './pages/principal.html' , '_blank';
      }, 1000); 
    }


