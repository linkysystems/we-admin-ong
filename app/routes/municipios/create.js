import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  term: inject(),

  model() {
    return hash({
      record: this.store.createRecord('municipio', {
        published: true
      }),
      categories: this.get('term')
                      .getSystemCategories()
    });
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