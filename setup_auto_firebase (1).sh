#!/data/data/com.termux/files/usr/bin/bash

CONFIG_FILE="$HOME/.config_firebase_script"

# Colores
green="\033[0;32m"
cyan="\033[0;36m"
reset="\033[0m"

# Función para leer configuración o crearla
cargar_configuracion() {
  if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${cyan}🌐 Ingresar ID del proyecto Firebase:${reset}"
    read -p "ID del proyecto: " PROJECT_ID
    echo -e "${cyan}📁 Ingresa la ruta del proyecto web:${reset}"
    read -p "Ruta completa (sin comillas): " PROJECT_PATH
    echo "PROJECT_ID=$PROJECT_ID" > "$CONFIG_FILE"
    echo "PROJECT_PATH='$PROJECT_PATH'" >> "$CONFIG_FILE"
  fi

  source "$CONFIG_FILE"
}

# Menú visual
mostrar_menu() {
  clear
  echo -e "${green}───▄▀▀▀▄▄▄▄▄▄▄▀▀▀▄───"
  echo "───█▒▒░░░░░░░░░▒▒█───"
  echo "────█░░█░░░░░█░░█────"
  echo "─▄▄──█░░░▀█▀░░░█──▄▄─"
  echo "█░░█─▀▄░░░░░░░▄▀─█░░█"
  echo -e "█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█"
  echo -e "█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█"
  echo -e "█░░║║║╠─║─║─║║║║║╠─░░█"
  echo -e "█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█"
  echo -e "█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█${reset}"
  echo -e "${cyan}⧣₊˚﹒✦₊  ⧣₊˚  𓂃★    ⸝⸝ ⧣₊˚﹒✦₊  ⧣₊˚${reset}"
  echo "  /)    /)"
  echo " (｡•ㅅ•｡)〝₎₎ 𝓪𝓫𝓸𝓾𝓽 𝓶𝓮! ✦₊ ˊ˗"
  echo ". .╭∪─∪────────── ✦ ⁺."
  echo ". .┊ ◟1 : Crear configuración "
  echo ". .┊﹒2 : Actualizar sitio (deploy)"
  echo ". .┊ꜝꜝ﹒3 : Acerca del script"
  echo ". .┊⨳゛4 : Ver archivos"
  echo ". .┊◟ヾ 5 : Cambiar configuración"
  echo ". .┊﹒𐐪 6 : Resetear proyecto"
  echo ". .┊ ◟﹫ 7 : Salir"
  echo " ╰───────────── ✦ ⁺."
}

# Crear configuración
crear_configuracion() {
  cd "$PROJECT_PATH" || return
  firebase init hosting --project "$PROJECT_ID" --public "." --single --non-interactive
}

# Actualizar deploy
actualizar_sitio() {
  cd "$PROJECT_PATH" || return
  firebase deploy --only hosting
  echo -e "${green}✅ Sitio actualizado exitosamente.${reset}"
  read -p "Presiona Enter para volver al menú..."
}

# Acerca de
mostrar_acerca() {
  clear
  echo -e "${cyan}✨ Script automático para gestionar despliegue de páginas web en Firebase Hosting.${reset}"
  echo -e "Incluye:"
  echo "- 📦 Instalación de herramientas (Node.js, Firebase CLI)"
  echo "- ⚙️ Inicialización automática del proyecto"
  echo "- ☁️ Deploy en un solo clic"
  echo "- 🗂 Explorador de archivos integrado"
  echo "- 💾 Configuración persistente"
  echo -e "
Creado por: Diego Fernando López - TikTok: W LOVE AND DRAMAS"
  read -p "Presiona Enter para volver al menú..."
}

# Ver archivos y administrar
ver_archivos() {
  echo -e "${cyan}📂 Contenido de $PROJECT_PATH${reset}"
  cd "$PROJECT_PATH" || return
  for item in *; do
    if [ -d "$item" ]; then
      echo -e "📁 $item"
    elif [ -f "$item" ]; then
      echo -e "📄 $item"
    fi
  done
  echo -e "
Opciones: [1] Crear archivo  [2] Eliminar archivo/carpeta  [3] Volver"
  read -p "Selecciona: " opcion_arch
  if [ "$opcion_arch" == "1" ]; then
    read -p "Nombre del archivo: " nombre
    touch "$nombre"
  elif [ "$opcion_arch" == "2" ]; then
    read -p "Nombre del archivo o carpeta a eliminar: " objetivo
    rm -rf "$objetivo"
  fi
}

# Cambiar configuración
cambiar_configuracion() {
  rm "$CONFIG_FILE"
  cargar_configuracion
}

# Resetear proyecto
resetear_proyecto() {
  cd "$PROJECT_PATH" || return
  rm -f firebase.json .firebaserc .gitignore
  echo -e "${cyan}🧹 Archivos eliminados para reiniciar el proyecto.${reset}"
  read -p "Presiona Enter para volver al menú..."
}

# Ejecutar
cargar_configuracion

while true; do
  mostrar_menu
  echo -n -e "${green}Selecciona una opción [1-7]: ${reset}"
  read opcion
  case $opcion in
    1) crear_configuracion ;;
    2) actualizar_sitio ;;
    3) mostrar_acerca ;;
    4) ver_archivos ;;
    5) cambiar_configuracion ;;
    6) resetear_proyecto ;;
    7) echo -e "${green}👋 Saliendo...${reset}"; exit ;;
    *) echo -e "${cyan}❌ Opción inválida.${reset}" ;;
  esac
done
