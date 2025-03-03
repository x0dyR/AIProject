window.addEventListener('load', () => {
    const canvas = document.getElementById('glCanvas');

    // Создаем glslCanvas-контекст (glslCanvas должен быть подключен через <script> в index.html)
    const sandbox = new GlslCanvas(canvas);

    // Загружаем шейдер через fetch
    fetch('shaders/background2.frag')
        .then(response => response.text())
        .then(fragmentShader => {
            sandbox.load(fragmentShader);

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                // Передаем размеры в шейдер
                sandbox.setUniform("u_resolution", canvas.width, canvas.height);
            }

            function updateTime() {
                // Передаем время в шейдер
                sandbox.setUniform("u_time", performance.now() / 1000);
                requestAnimationFrame(updateTime);
            }

            // Обработка изменения размера окна
            window.addEventListener('resize', resize);

            // Запускаем всё
            resize();
            updateTime();
        })
        .catch(err => console.error('Ошибка загрузки шейдера:', err));
});
