import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(page_title="Surbhi 💖", layout="wide")

# Hide Streamlit chrome so the 3D proposal page renders full-screen.
st.markdown(
    """
    <style>
        #MainMenu, header, footer {visibility: hidden;}
        .block-container {padding: 0 !important; max-width: 100% !important;}
        div[data-testid="stAppViewContainer"] {padding: 0;}
        iframe {display: block;}
    </style>
    """,
    unsafe_allow_html=True,
)

ASSETS_DIR = Path(__file__).parent / "assets"
css = (ASSETS_DIR / "style.css").read_text(encoding="utf-8")
three_scene_js = (ASSETS_DIR / "three-scene.js").read_text(encoding="utf-8")
script_js = (ASSETS_DIR / "script.js").read_text(encoding="utf-8")

PAGE_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
<style>__CSS__</style>
</head>
<body>
  <div id="bg-canvas"></div>

  <div class="container">
    <div class="proposal-card">
      <div class="name">Surbhi</div>
      <div class="question">Will you be my girlfriend? 💕</div>
      <div class="buttons">
        <button id="yesBtn">Yes 💖</button>
        <button id="noBtn">No</button>
      </div>
    </div>
  </div>

  <div class="final-screen">
    <h1>Yay! 🎉</h1>
    <p>Surbhi said YES! You just made me the happiest person alive.
       I promise to make you smile every single day. I love you! ❤️</p>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
  <script>__THREE_SCENE__</script>
  <script>__SCRIPT__</script>
</body>
</html>
"""

page_html = (
    PAGE_TEMPLATE.replace("__CSS__", css)
    .replace("__THREE_SCENE__", three_scene_js)
    .replace("__SCRIPT__", script_js)
)

components.html(page_html, height=900, scrolling=False)
