# Instalación proyecto con GULP:

    1. Instalación Node.js v10.24.1
        -> https://nodejs.org/en/blog/release/v10.24.1

    2. Una vez instalado Node accedemos a la ruta del proyecto y abrimos una terminal a nivel del gulpfile.js
        2.1 Ejecutamos npm install —global gulp-cli
        2.2 Ejecutamos npm install gulp
        2.3 Ejecutamos gulp -v para comprobar que se haya instalado todo correctamente y verificar las versiones
        2.4 Ejecutamos npm install

    3. Inicializamos el proyecto. La configuración del gulpfile hace que los archivos en la carpeta /src sean compilados, generando una versión entregable dentro de la carpeta /build. Gulp compila automáticamente a medida que vamos modificando y guardando los archivos. Además, refresca automáticamente el navegador por lo que no hay que estar actualizando para ver los cambios.

# Para iniciar el proyecto debemos ejecutar el siguiente comando en la misma ruta donde se encuentra el gulpfile.js:
	gulp

# Para parar el proyecto:
     Ctrl + C en la terminal

# Descripción:
    Estructura de carpetas inicial dentro de:
        /sass
        /pug
    
    1. Modificar el archivo variables.scss con las variables del proyecto
    2. Definir el ui kit de la aplicación a nivel de css partiendo del diseño haciendo uso de la estructura disponible. Esta estructura inicial se puede modificar según las necesidades.
    