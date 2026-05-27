const preferenceInitScript = `
(function () {
  try {
    var appearance = localStorage.getItem("wv_appearance");
    if (appearance === "light" || appearance === "dark") {
      document.documentElement.dataset.theme = appearance;
    }

    var browser = localStorage.getItem("wv_use_browser_locale") === "1";
    var stored = localStorage.getItem("i18nextLng");
    var lang = "en";

    if (!browser && (stored === "en" || stored === "de")) {
      lang = stored;
    } else {
      var langs = navigator.languages || [navigator.language || "en"];
      for (var i = 0; i < langs.length; i++) {
        var code = (langs[i] || "").split("-")[0].toLowerCase();
        if (code === "de") {
          lang = "de";
          break;
        }
        if (code === "en") {
          lang = "en";
          break;
        }
      }
    }

    document.documentElement.lang = lang;
  } catch (error) {}
})();
`;

export function PreferenceInitScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: preferenceInitScript,
      }}
    />
  );
}
