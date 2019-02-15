import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

let editorLocaleCache, editorLocaleUrlCache;

export default Controller.extend({
  ajax: inject(),
  session: inject('session'),
  settings: inject('settings'),

  editorOptions: computed('settings.data', {
    get() {
      const opts = {
        min_height: 150,
        theme: 'modern',
        convert_urls: false,
        branding: false,
        extended_valid_elements: 'iframe[src|frameborder|style|scrolling|class|width|height|name|align]',
        plugins: [
          'advlist autolink lists link image hr anchor',
          'code fullscreen',
          'insertdatetime media nonbreaking save table contextmenu directionality',
          'emoticons paste textcolor colorpicker textpattern codesample'
        ],
        toolbar1: 'undo redo | insert | styleselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media |  codesample',
        language: this.getEditorLocale(),
        language_url: this.getEditorLocaleUrl()
      };
      return opts;
    }
  }),

  getEditorLocale() {
    if (editorLocaleCache) {
      return editorLocaleCache;
    }

    let locale = this.get('settings.data.activeLocale');
    // use default en-us locale
    if (!locale || locale === 'en' || locale === 'en-us') {
      return null;
    }

    if (locale.indexOf('-') > -1) {
      const parts = locale.split('-');
      // Locales with more than 2 parts not are supported
      // TODO!
      if (parts.length > 2) {
        return null;
      }
      // Converts the seccond part of the locale to uppercase:
      parts[1] = parts[1].toUpperCase();
      // override the locale?
      locale = parts.join('_');
    } else {
      return null;
    }

    editorLocaleCache = locale;

    return editorLocaleCache;
  },

  getEditorLocaleUrl() {
    if (editorLocaleUrlCache) {
      return editorLocaleUrlCache;
    }

    let locale = this.get('settings.data.activeLocale');
    // use default en-us locale
    if (!locale || locale === 'en' || locale === 'en-us') {
      return null;
    }

    if (locale.indexOf('-') > -1) {
      const parts = locale.split('-');
      // Locales with more than 2 parts not are supported
      // TODO!
      if (parts.length > 2) {
        return null;
      }
      // Converts the seccond part of the locale to uppercase:
      parts[1] = parts[1].toUpperCase();
      // override the locale?
      locale = parts.join('_');
    } else {
      return null;
    }

    editorLocaleUrlCache = `/admin/tiny-mce-languages/${locale}.js`;

    return editorLocaleUrlCache;
  },

  actions: {}
});
