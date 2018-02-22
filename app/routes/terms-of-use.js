import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model() {
    return Ember.RSVP.hash({
      record: this.findOrCreateTermsOfUse()
    });
  },

  findOrCreateTermsOfUse() {
    return new window.Promise((resolve, reject)=> {
      this.findTermOfUse()
      .then( (record)=> {
        if (record) {
          resolve(record);
        } else {
          // not found, create one:
          let r = this.get('store').createRecord('content', {
            title: 'Termos de uso e de responsabilidade limitada',
            published: true
          });
          resolve(r);
        }
      })
      .catch(reject);
    });
  },

  findTermOfUse() {
    const ss = this.get('settings').get('systemSettings');

    return new window.Promise((resolve)=> {
      if (!ss.termOfUseId) {
        return resolve();
      }

      this.get('store')
      .findRecord('content', ss.termOfUseId)
      .then( resolve )
      .catch( ()=> {
        // not found or error:
        resolve();
        return null;
      });
    });
  },

  actions: {
    save(record) {
      let s = this.get('settings');

      record.save()
      .then( (r)=> {
        return s.setSystemSettings({
          termOfUseModel: 'content',
          termOfUseId: record.id
        })
        .then( () => {
          return r;
        });
      })
      .then( (r)=> {
        this.get('notifications').success('O termo de uso foi salvo com sucesso.');

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