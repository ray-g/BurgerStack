import { expect } from 'chai';

require('core-js');
import { AppComponent } from '../../../client/app/app.component';

describe('AppComponent', () => {
  it('name should be "BurgerStack"', () => {
    let appComp = new AppComponent();
    expect(appComp.name).to.equal('BurgerStack');
  });
});
