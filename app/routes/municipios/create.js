import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  term: Ember.inject.service(),

  model() {
    return {
      record: this.store.createRecord('municipio', {
        published: true
      }),
      categories: this.get('term')
                      .getSystemCategories()
    };
  },
  actions: {
    save(record) {
      record.save()
      .then( (r)=> {
        this.get('notifications')
            .success('Municipio registrado com sucesso.');

        this.transitionTo('municipios.item', r.id);
        this.send('scrollToTop');
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
        return null;
      });
    }
  }
});