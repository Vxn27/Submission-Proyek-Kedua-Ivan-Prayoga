import { register } from '../../data/api';
import { showLoading, hideLoading } from '../../utils/common'; 

export default class RegisterPage {
  // ... fungsi render() tidak berubah
  async render() {
    return `
      <section class="container">
        <h1>Register</h1>
        <form id="register-form" class="auth-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="button-submit">Register</button>
          <p>Already have an account? <a href="#/login">Login here</a>.</p>
        </form>
        <div id="error-message" class="error-message"></div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#register-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = form.elements.name.value;
      const email = form.elements.email.value;
      const password = form.elements.password.value;
      const errorMessageContainer = document.querySelector('#error-message');
      errorMessageContainer.textContent = '';

      showLoading();
      try {
        await register({ name, email, password });
        hideLoading();
        alert('Registration successful! Please login.');
        window.location.hash = '#/login';
      } catch (error) {
        hideLoading();
      errorMessageContainer.textContent = 'Error: ${error.message}';      
      }
    });
  }
}