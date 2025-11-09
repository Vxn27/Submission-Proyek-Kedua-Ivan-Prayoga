import { login } from '../../data/api';
import { showLoading, hideLoading } from '../../utils/common'; 
export default class LoginPage {
  // ... fungsi render() tidak berubah
  async render() {
    return `
      <section class="container">
        <h1>Login</h1>
        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="button-submit">Login</button>
          <p>Don't have an account? <a href="#/register">Register here</a>.</p>
        </form>
        <div id="error-message" class="error-message"></div>
      </section>
    `;
  }
  async afterRender() {
    const form = document.querySelector('#login-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = form.elements.email.value;
      const password = form.elements.password.value;
      const errorMessageContainer = document.querySelector('#error-message');
      errorMessageContainer.textContent = ''; 
      showLoading(); 
      try {
        await login({ email, password });
        hideLoading(); 
        window.location.hash = '#/';
        window.location.reload(); 
      } catch (error) {
        hideLoading(); 
      errorMessageContainer.textContent = 'Error: ${error.message}';      }
    });
  }
}