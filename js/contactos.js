document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    // Add this HTML to your contactos.html just before the closing </body> tag
    const notificationHTML = `
        <div id="notification" class="notification" style="display: none;">
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <p>Mensagem enviada com sucesso! Obrigado pelo teu contacto.</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', notificationHTML);

    // Add this CSS to your contactos.css
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #004AAD;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .notification i {
            font-size: 20px;
        }

        .notification p {
            margin: 0;
            font-size: 16px;
        }
    `;
    document.head.appendChild(styleSheet);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            rating: document.querySelector('input[name="rating"]:checked')?.value
        };

        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'A enviar...';
            submitButton.disabled = true;

            // Send the form data to our API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Show custom notification
                const notification = document.getElementById('notification');
                notification.style.display = 'block';
                setTimeout(() => notification.classList.add('show'), 100);
                
                // Hide notification after 3 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.style.display = 'none', 300);
                }, 3000);

                form.reset();
            } else {
                throw new Error(result.message || 'Erro ao enviar mensagem');
            }
        } catch (error) {
            console.error('Error:', error);
            // Show error notification
            const notification = document.getElementById('notification');
            notification.style.backgroundColor = '#dc3545';
            notification.querySelector('i').className = 'fas fa-exclamation-circle';
            notification.querySelector('p').textContent = 'Ocorreu um erro ao enviar a mensagem. Por favor, tenta novamente.';
            notification.style.display = 'block';
            setTimeout(() => notification.classList.add('show'), 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.style.display = 'none', 300);
            }, 3000);
        } finally {
            // Restore button state
            submitButton.textContent = 'Enviar Mensagem';
            submitButton.disabled = false;
        }
    });

    // Add animation to rating stars
    const stars = document.querySelectorAll('.rating label');
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.2)';
        });
        star.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
}); 