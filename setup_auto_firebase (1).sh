#!/data/data/com.termux/files/usr/bin/bash

# Colores
R='\033[0;31m'
G='\033[0;32m'
Y='\033[1;33m'
C='\033[1;36m'
W='\033[1;37m'
NC='\033[0m'

# Ruta fija y proyecto
PROJECT_DIR="/storage/emulated/0/Download/DORAMAS TV 10"
PROJECT_ID="abby-cdb30"

# Banner
banner() {
  clear
  echo -e "${C}───▄▀▀▀▄▄▄▄▄▄▄▀▀▀▄───"
  echo -e "───█▒▒░░░░░░░░░▒▒█───"
  echo -e "────█░░█░░░░░█░░█────"
  echo -e "─▄▄──█░░░▀█▀░░░█──▄▄─"
  echo -e "${W}█░░█─▀▄░░░░░░░▄▀─█░░█"
  echo -e "${W}█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█"
  echo -e "${Y}█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█"
  echo -e "${Y}█░░║║║╠─║─║─║║║║║╠─░░█"
  echo -e "${Y}█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█"
  echo -e "${Y}█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█${NC}"
}

# Menú visual
show_menu() {
  clear
  echo -e "${C}⧣₊˚﹒✦₊  ⧣₊˚  𓂃★    ⸝⸝ ⧣₊˚﹒✦₊  ⧣₊˚"
  echo "      /)    /)"
  echo "    (｡•ㅅ•｡)〝₎₎ ¡Bienvenido! ✦₊ ˊ˗ "
  echo ". .╭∪─∪────────── ✦ ⁺."
  echo -e ". .┊ ◟ ${G}opción 1${NC} : Inicializar configuración"
  echo -e ". .┊﹒ ${G}opción 2${NC} : Subir página (deploy)"
  echo -e ". .┊ꜝꜝ﹒ ${G}opción 3${NC} : Acerca del script"
  echo -e ". .┊ ⨳゛ ${G}opción 4${NC} : Salir"
  echo ". .┊ ◟ヾ Autor : Diego Fernando López"
  echo ". .┊﹒𐐪 TikTok : W LOVE AND DRAMAS"
  echo "   ╰─────────────  ✦ ⁺."
  echo -e "⧣₊˚﹒✦₊  ⧣₊˚  𓂃★    ⸝⸝ ⧣₊˚﹒✦₊  ⧣₊˚${NC}"
}

# Dependencias
ensure_tools() {
  if ! command -v node >/dev/null 2>&1; then
    echo -e "${Y}➤ Instalando Node.js...${NC}"
    pkg update -y && pkg install nodejs -y
  fi
  if ! command -v firebase >/dev/null 2>&1; then
    echo -e "${Y}➤ Instalando Firebase CLI...${NC}"
    npm install -g firebase-tools
  fi
}

# Login
login_firebase() {
  firebase login --no-localhost
}

# Inicializar archivos
init_config() {
  cd "$PROJECT_DIR" || { echo -e "${R}❌ Carpeta no encontrada: $PROJECT_DIR${NC}"; return; }
  [ ! -f index.html ] && echo -e "${Y}⚠️  No hallé index.html en $PROJECT_DIR${NC}" && return
  cat > .firebaserc <<EOF
{
  "projects": {
    "default": "$PROJECT_ID"
  }
}
EOF
  cat > firebase.json <<EOF
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
EOF
  echo -e "${G}✅ Configuración inicial completada.${NC}"
}

# Deploy
deploy_site() {
  cd "$PROJECT_DIR" || { echo -e "${R}❌ Carpeta no encontrada: $PROJECT_DIR${NC}"; return; }
  firebase deploy --only hosting && echo -e "${G}✅ Sitio actualizado en línea.${NC}"
}

# Acerca de
show_about() {
  clear
  echo -e "${C}✦ Información del Script ✦${NC}"
  echo -e "${W}────────────────────────────────────────────${NC}"
  echo -e "${Y}➤ Nombre:${NC} Publicador Automático"
  echo -e "${Y}➤ Autor:${NC} Diego Fernando López"
  echo -e "${Y}➤ Proyecto Firebase:${NC} $PROJECT_ID"
  echo -e "${Y}➤ Ruta Fija:${NC} $PROJECT_DIR"
  echo -e "${Y}➤ Funciones:${NC}"
  echo -e "  - Verifica e instala Node.js y Firebase CLI"
  echo -e "  - Inicia sesión en Firebase (si es necesario)"
  echo -e "  - Crea los archivos '.firebaserc' y 'firebase.json'"
  echo -e "  - Ejecuta 'firebase deploy' automáticamente"
  echo -e "  - Usa un menú visual bonito con arte y colores"
  echo -e "${W}────────────────────────────────────────────${NC}"
  read -p $'\nPresiona Enter para volver al menú...'
}

# Menú interactivo
while true; do
  banner
  show_menu
  read -p $'\nSelecciona una opción [1-4]: ' choice
  case "$choice" in
    1)
      ensure_tools
      login_firebase
      init_config
      read -p $'\nPresiona Enter para volver al menú...'
      ;;
    2)
      ensure_tools
      login_firebase
      deploy_site
      read -p $'\nPresiona Enter para volver al menú...'
      ;;
    3)
      show_about
      ;;
    4)
      echo -e "${Y}👋 ¡Hasta luego!${NC}"
      exit 0
      ;;
    *)
      echo -e "${R}❌ Opción inválida. Intenta de nuevo.${NC}"
      sleep 1
      ;;
  esac
done
