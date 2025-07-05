#!/data/data/com.termux/files/usr/bin/bash

echo "🔍 Verificando e instalando dependencias necesarias..."

# Verificar Node.js
if command -v node > /dev/null 2>&1; then
  echo "✅ Node.js ya está instalado (versión $(node -v))"
else
  echo "📦 Instalando Node.js..."
  pkg update -y && pkg install nodejs -y
fi

# Verificar Firebase CLI
if command -v firebase > /dev/null 2>&1; then
  echo "✅ Firebase CLI ya está instalado (versión $(firebase --version))"
else
  echo "📥 Instalando Firebase CLI..."
  npm install -g firebase-tools
fi

# Verificar login de Firebase
echo "🔐 ¿Ya habías iniciado sesión en Firebase desde este dispositivo?"
read -p "Escribe 's' si ya habías iniciado sesión, o cualquier otra tecla para iniciar sesión ahora: " loginHecho

if [ "$loginHecho" != "s" ]; then
  firebase login
fi

# Preguntar por la carpeta del proyecto
echo "📁 Ingresa la ruta donde tienes tu sitio web (ej: /storage/emulated/0/Download/DORAMAS TV 10)"
read -p "Ruta: " carpetaWeb

# Verificar que la carpeta exista
if [ ! -d "$carpetaWeb" ]; then
  echo "❌ La carpeta '$carpetaWeb' no existe. Revisa la ruta y vuelve a intentarlo."
  exit 1
fi

# Ir a la carpeta
cd "$carpetaWeb" || exit

# Iniciar Firebase
echo "🚀 Ejecutando 'firebase init hosting'..."
firebase init hosting

echo ""
echo "✅ Configuración completa. Ahora puedes hacer:"
echo "👉 firebase deploy"
