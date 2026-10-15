// Modo trabajo del Centro JAN: cada tarea se HACE dentro de la app. Este archivo es el MISMO en el PC y en el iPhone
// (el PC lo importa desde aquí): qué tipo de espacio de trabajo tiene cada tarea, su plantilla, su primer paso y sus atajos.
// Atajos = enlaces directos al sitio exacto donde se hace lo de fuera (nunca se incrusta nada).
(function (g) {
  'use strict'
  var sinAcentos = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() }
  var SPOTIFY_ID = '00nP0BkqQ96pB20X7KFaH3'

  var ATAJOS = {
    spotify: { txt: 'Spotify for Artists · tu perfil', url: 'https://artists.spotify.com/c/artist/' + SPOTIFY_ID + '/profile' },
    instagram_perfil: { txt: 'Instagram · editar perfil', url: 'https://www.instagram.com/accounts/edit/' },
    instagram: { txt: 'Instagram', url: 'https://www.instagram.com/janthejuniper_/' },
    distrokid: { txt: 'DistroKid · subir lanzamiento', url: 'https://distrokid.com/new/' },
    sgae: { txt: 'SGAE · área de socios', url: 'https://www.sgae.es/' },
    youtube: { txt: 'YouTube Studio', url: 'https://studio.youtube.com/' },
    submithub: { txt: 'SubmitHub', url: 'https://www.submithub.com/' },
    groover: { txt: 'Groover', url: 'https://groover.co/' },
    drive: { txt: 'Google Drive', url: 'https://drive.google.com/drive/my-drive' },
    pinterest: { txt: 'Pinterest', url: 'https://www.pinterest.com/' },
    correo: { txt: 'Abrir en tu correo', url: 'mailto:' }, // usa el texto escrito aquí (asunto + cuerpo)
    proyectos: { txt: 'Abrir Proyectos en el Centro', interno: 'proyectos' },
    carpeta: { txt: 'Abrir la carpeta del proyecto', interno: 'carpeta' },
  }

  // cada regla: palabras del título (sin acentos) → tipo + plantilla. La primera que encaja gana.
  var REGLAS = [
    { si: /enlace .*bio|enlace unico/, tipo: 'fuera', paso: 'Abre tu perfil de Instagram en modo edición.', pasos: ['Elegir el enlace (escucha + press kit + contacto)', 'Ponerlo en la bio de Instagram', 'Comprobar que funciona desde el móvil'], atajos: ['instagram_perfil'] },
    { si: /enlaces de escucha|contacto/, tipo: 'texto', paso: 'Pega el enlace de Spotify. El resto ya está casi.',
      secciones: [['Escucha (Spotify, Apple Music, YouTube)', 800], ['Contacto (email, management, booking)', 400]], atajos: ['spotify'] },
    { si: /\bbio\b/, tipo: 'texto', paso: 'Escribe en UNA frase quién eres y cómo suena tu música. Solo eso.',
      secciones: [['Bio corta (Instagram y redes)', 150], ['Bio larga (Spotify for Artists)', 1500]], atajos: ['spotify', 'instagram_perfil'] },
    { si: /presupuesto .*(slatin|mezcla)|pedir presupuesto/, tipo: 'texto', paso: 'Escribe el asunto del correo. Lo demás ya está empezado abajo.',
      secciones: [['Asunto', 120, 'Presupuesto mezcla y máster · 6 canciones · Jan The Juniper'], ['Correo', 3000, 'Hola,\n\nSoy Jan The Juniper, artista y productora de Castellón. Estoy terminando un álbum de 6 canciones y me gustaría pedir presupuesto de mezcla y máster.\n\n· Número de canciones: 6\n· Estilo: \n· Stems: \n· Plazo ideal: \n\nGracias,\nJan']],
      atajos: ['correo'] },
    { si: /\bsgae\b/, tipo: 'fuera', paso: 'Abre SGAE y entra en tu área de socios. Nada más.', pasos: ['Entrar en el área de socios', 'Declarar cada canción (título, autores, %)', 'Guardar el justificante de cada registro'], atajos: ['sgae'] },
    { si: /distribuidora|distrokid/, tipo: 'fuera', paso: 'Abre DistroKid y mira qué te pide para subir. Solo mirar.', pasos: ['Máster WAV final de la canción', 'Portada 3000×3000', 'Créditos y letra', 'Fecha de salida (3 semanas o más)', 'Subir y guardar el enlace de pre-save'], atajos: ['distrokid'] },
    { si: /drive/, tipo: 'fuera', paso: 'Abre la carpeta del proyecto y localiza el archivo.', pasos: ['Localizar el archivo en el PC', 'Subirlo a Drive', 'Comprobar que se abre y pegar aquí el enlace'], atajos: ['carpeta', 'drive'] },
    { si: /hitos/, tipo: 'fuera', paso: 'Abre el primer proyecto de la lista y marca un hito que ya tengas hecho.', pasos: ['Repasar cada canción', 'Marcar lo que ya está hecho'], atajos: ['proyectos'] },
    { si: /\bpublica\b|\bclip\b|adelanto|\bpost\b/, tipo: 'fuera', paso: 'Elige el clip: el primero que te guste vale.', pasos: ['Elegir el clip (10–15 s)', 'Escribir el texto del post', 'Publicar con la canción como audio + sticker de Spotify', 'Pegar aquí el enlace'], atajos: ['instagram'] },
    { si: /foto/, tipo: 'fotos', paso: 'Marca la primera foto que te represente. Sin pensarlo mucho.', cuantas: 5 },
    { si: /revis|escuch|decidir la cancion|mezcla|master|regrabar|voces/, tipo: 'escucha', paso: 'Dale al play y escucha 30 segundos. Apunta lo primero que notes.' },
    { si: /playlist|blogs|influencer|submithub|groover/, tipo: 'lista', paso: 'Apunta UNA playlist o blog donde te gustaría sonar.', columnas: ['Nombre', 'Enlace'], atajos: ['submithub', 'groover'] },
    { si: /presupuesto|ahorro|gasto/, tipo: 'lista', paso: 'Apunta la primera partida con un importe aproximado.', columnas: ['Partida', 'Importe'], importe: true },
    { si: /rider/, tipo: 'texto', paso: 'Apunta qué necesitas sí o sí en el escenario.',
      secciones: [['Formación y duración', 600], ['Sonido (canales, micros, monitores)', 1500], ['Backline y lo que llevas tú', 1000], ['Contacto técnico', 300]] },
    { si: /calendario de contenido/, tipo: 'texto', paso: 'Apunta UNA idea de post para la semana del lanzamiento.',
      secciones: [['4 semanas antes', 800], ['2 semanas antes', 800], ['Semana de salida', 800], ['Semana después', 800]], atajos: ['instagram'] },
    { si: /plan de publicacion/, tipo: 'texto', paso: 'Mira tus turnos de la semana y apunta 2 huecos libres.',
      secciones: [['Huecos reales (fuera de tus turnos)', 600], ['Qué publico y cuándo', 1500]] },
    { si: /portada|identidad visual/, tipo: 'texto', paso: 'Pega UNA imagen de referencia que te guste.',
      secciones: [['Concepto', 800], ['Referencias (enlaces de Pinterest)', 1000], ['Paleta y tipografía', 400], ['Quién la hace y para cuándo', 300]], atajos: ['pinterest'] },
    { si: /visualizer|video lirico|videoclip|video/, tipo: 'texto', paso: 'Describe en una frase la imagen principal del vídeo.',
      secciones: [['Idea', 800], ['Guion o escenas', 2000], ['Herramientas y quién', 400]], atajos: ['youtube'] },
  ]
  var POR_DEFECTO = { tipo: 'texto', paso: 'Escribe la primera frase. Mal escrita también vale.', secciones: [['Trabajo', 5000]] }

  var NOMBRES = { texto: 'Escribir', lista: 'Lista', escucha: 'Escuchar y decidir', fotos: 'Elegir fotos', fuera: 'Fuera de la app' }

  function regla(t) {
    var s = sinAcentos(t && t.titulo)
    for (var i = 0; i < REGLAS.length; i++) if (REGLAS[i].si.test(s)) return REGLAS[i]
    return POR_DEFECTO
  }
  /** El tipo de espacio de trabajo de una tarea (el que ya tenga guardado manda). */
  function tipoDe(t) { return (t && t.trabajo && t.trabajo.tipo) || regla(t).tipo }
  /** Un trabajo nuevo y vacío para la tarea, con su plantilla. Si `tipo` se da, se usa ese (cambio manual). */
  function nuevo(t, tipo) {
    var r = regla(t); tipo = tipo || r.tipo
    var w = { tipo: tipo, minutos: 0, actualizado: null, acabado: null }
    if (tipo === 'texto') w.secciones = (tipo === r.tipo && r.secciones ? r.secciones : POR_DEFECTO.secciones).map(function (x, i) { return { id: 's' + i, titulo: x[0], max: x[1], texto: x[2] || '' } })
    if (tipo === 'lista') { w.filas = []; w.columnas = (tipo === r.tipo && r.columnas) || ['Nombre', 'Enlace']; w.importe = !!(tipo === r.tipo && r.importe) }
    if (tipo === 'fuera') { w.pasos = (tipo === r.tipo && r.pasos ? r.pasos : ['Hacerlo', 'Guardar el justificante']).map(function (x, i) { return { id: 'p' + i, texto: x, hecho: false } }); w.justificante = '' }
    if (tipo === 'escucha') { w.notas = ''; w.decision = '' }
    if (tipo === 'fotos') w.fotos = []
    return w
  }
  /** Lo que la plantilla sugiere para esta tarea: primer paso, atajos, columnas de la lista… */
  function guia(t) {
    var r = regla(t), tipo = tipoDe(t), mismo = tipo === r.tipo
    return {
      tipo: tipo, nombre: NOMBRES[tipo], paso: mismo ? r.paso : POR_DEFECTO.paso,
      atajos: ((mismo && r.atajos) || []).map(function (k) { return Object.assign({ id: k }, ATAJOS[k]) }),
      columnas: (t.trabajo && t.trabajo.columnas) || (mismo && r.columnas) || ['Nombre', 'Enlace'], importe: t.trabajo && t.trabajo.columnas ? !!t.trabajo.importe : !!(mismo && r.importe), cuantas: (mismo && r.cuantas) || 5,
    }
  }
  /** ¿Has empezado de verdad? (para «Seguir donde lo dejaste») */
  function empezado(w) {
    if (!w) return false
    if ((w.minutos || 0) > 0) return true
    if (w.secciones && w.secciones.some(function (s) { return s.editado })) return true // el texto que trae la plantilla no cuenta: solo lo que escribes tú
    return !!((w.filas && w.filas.length) || (w.pasos && w.pasos.some(function (p) { return p.hecho })) || (w.notas || '').trim() || (w.decision || '').trim() || (w.fotos && w.fotos.length) || (w.justificante || '').trim())
  }
  /** Cuánto llevas (0–1) — para la barrita de progreso del trabajo */
  function progreso(w) {
    if (!w) return 0
    if (w.acabado) return 1
    if (w.tipo === 'texto') { var s = w.secciones || []; return s.length ? s.filter(function (x) { return x.editado && (x.texto || '').trim() }).length / s.length : 0 }
    if (w.tipo === 'fuera') { var p = w.pasos || []; return p.length ? p.filter(function (x) { return x.hecho }).length / p.length : 0 }
    if (w.tipo === 'lista') { var f = w.filas || []; return f.length ? Math.min(1, f.filter(function (x) { return x.hecho }).length / f.length) : 0 }
    if (w.tipo === 'fotos') return Math.min(1, (w.fotos || []).length / 5)
    if (w.tipo === 'escucha') return ((w.notas || '').trim() ? 0.5 : 0) + ((w.decision || '').trim() ? 0.5 : 0)
    return 0
  }
  /** mailto: con el asunto y el correo escritos en el trabajo */
  /** «1.500,00 €», «1500.5», «300» → número (formato español incluido); lo que no es un número → 0 */
  function numero(x) {
    var s = (String(x == null ? '' : x).replace(/[€\s]/g, '').match(/-?[\d.,]*\d/) || [''])[0] // el número que escribiste, aunque lleve «aprox» detrás
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.')
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '') // «1.500», «1.234.567»: puntos de miles
    var n = parseFloat(s)
    return isFinite(n) ? n : 0
  }
  function total(w) { return ((w && w.filas) || []).reduce(function (a, f) { return a + numero(f.b) }, 0) }
  /** Cambiar el tipo de trabajo NUNCA borra lo hecho: lo de cada tipo queda guardado y vuelve si regresas a él */
  function cambiarTipo(t, w, tipo) {
    if (!w || w.tipo === tipo) return w
    var guardados = Object.assign({}, w.guardados || {}), previo = Object.assign({}, w)
    delete previo.guardados; guardados[w.tipo] = previo
    var n = guardados[tipo] ? Object.assign({}, guardados[tipo]) : nuevo(t, tipo)
    delete guardados[tipo]
    n.minutos = Math.max(w.minutos || 0, n.minutos || 0); n.guardados = guardados; n.acabado = w.acabado || null
    if (w.archivo) { n.archivo = w.archivo; n.exportado = w.exportado }
    return n
  }
  function mailto(w) {
    var s = (w && w.secciones) || [], asunto = (s[0] && s[0].texto) || '', cuerpo = (s[1] && s[1].texto) || ''
    return 'mailto:?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo)
  }
  /** id para una fila o paso nuevo (único: así cada uno se guarda por separado entre dispositivos) */
  function nuevoId(pre) { return pre + Date.now().toString(36) + Math.random().toString(36).slice(2, 5) }
  /** Un trabajo antiguo sin ids en secciones/pasos/filas los recibe (por posición, igual en PC e iPhone) */
  function normalizar(w) {
    if (!w) return w
    var x = JSON.parse(JSON.stringify(w))
    ;[['secciones', 's'], ['pasos', 'p'], ['filas', 'f']].forEach(function (par) {
      if (Array.isArray(x[par[0]])) x[par[0]] = x[par[0]].map(function (e, i) { return e && typeof e === 'object' && e.id == null ? Object.assign({ id: par[1] + i }, e) : e })
    })
    return x
  }
  /** Un trabajo guardado solo lleva lo que alguien escribió: lo demás (secciones o pasos que nadie tocó, valores por
   *  defecto) sale de su plantilla, que es la misma en el PC y en el iPhone. Respeta el orden de la plantilla. */
  function completar(w, t) {
    if (!w) return w
    var x = normalizar(w), tpl = normalizar(nuevo(t || {}, x.tipo || tipoDe(t || {})))
    Object.keys(tpl).forEach(function (k) {
      if (x[k] === undefined) { x[k] = tpl[k]; return }
      if ((k === 'secciones' || k === 'pasos') && Array.isArray(x[k]) && Array.isArray(tpl[k])) {
        var pos = function (id) { for (var q = 0; q < tpl[k].length; q++) if (tpl[k][q].id === id) return q; return -1 }
        tpl[k].forEach(function (e, i) {
          if (x[k].some(function (y) { return y && y.id === e.id })) return
          var en = x[k].length
          for (var n = 0; n < x[k].length; n++) if (pos(x[k][n] && x[k][n].id) > i) { en = n; break }
          x[k].splice(en, 0, e)
        })
      }
    })
    return x
  }
  /** Con qué comparar la PRIMERA vez que se guarda el trabajo de una tarea: con su plantilla (así solo viaja lo que
   *  escribiste, y dos dispositivos que empiezan a la vez no se pisan las secciones vacías de la plantilla) */
  function baseDe(t, w) { return normalizar(nuevo(t || {}, (w && w.tipo) || tipoDe(t || {}))) }
  var api = { completar: completar, baseDe: baseDe, nuevoId: nuevoId, normalizar: normalizar, ATAJOS: ATAJOS, NOMBRES: NOMBRES, tipoDe: tipoDe, nuevo: nuevo, guia: guia, empezado: empezado, progreso: progreso, mailto: mailto, sinAcentos: sinAcentos, numero: numero, total: total, cambiarTipo: cambiarTipo }
  if (typeof module !== 'undefined' && module.exports) module.exports = api
  g.TRABAJO = api
})(typeof globalThis !== 'undefined' ? globalThis : this)
