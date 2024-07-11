import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import ShowHardwareConfigButton from '../../src/components/elements/ShowHardwareConfigButton.vue';
import { createStore } from 'vuex';



import uiStore from '../../src/modules/uiStore.js'


const createVuexStore = () => 

    createStore({
        modules:{
            ui: uiStore,
        }
    });
    
describe('ShowHardwareConfigButton.vue tests', () => {

  test('Displays mass correctly', async () => {
    const store = createVuexStore();
    let config = JSON.parse('{"name": "spin30", "version": "2.0", "date": 1718893734, "aud": "https://app.practable.io/ed0/spinner-default-3.0", "images": [], "parameters": {"for": "ui", "are": [{"k": "title", "v": "Spinning Disk", "m": "68g", "d": "40mm", "t": "20mm"}]}}')
    store.dispatch('setConfigJSON', config);
    
    const wrapper = mount(ShowHardwareConfigButton, {
      global:{
        plugins: [store]
      }
    });

    await wrapper.get('#config-toolbar-button').trigger('click');

    expect(wrapper.find('#modal-show').text()).toContain('Hardware Configuration');
  
  })

  test('getSpinnerID computes correctly', async () => {
    const store = createVuexStore();
    let config = JSON.parse('{"name": "spin30", "version": "2.0", "date": 1718893734, "aud": "https://app.practable.io/ed0/spinner-default-3.0", "images": [], "parameters": {"for": "ui", "are": [{"k": "title", "v": "Spinning Disk", "m": "68g", "d": "40mm", "t": "20mm"}]}}')
    store.dispatch('setConfigJSON', config);
    
    const wrapper = mount(ShowHardwareConfigButton, {
      global:{
        plugins: [store]
      }
    });

    await wrapper.get('#config-toolbar-button').trigger('click');
    expect(wrapper.find('#modal-show').text()).toContain('spin30');
  
  
  })

  test('getSpinnerMass computes correctly', async () => {
    const store = createVuexStore();
    let config = JSON.parse('{"name": "spin30", "version": "2.0", "date": 1718893734, "aud": "https://app.practable.io/ed0/spinner-default-3.0", "images": [], "parameters": {"for": "ui", "are": [{"k": "title", "v": "Spinning Disk", "m": "68g", "d": "40mm", "t": "20mm"}]}}')
    store.dispatch('setConfigJSON', config);
    
    const wrapper = mount(ShowHardwareConfigButton, {
      global:{
        plugins: [store]
      }
    });

    await wrapper.get('#config-toolbar-button').trigger('click');
    expect(wrapper.find('#modal-show').text()).toContain('68g');
  
  
  })

  test('getSpinnerDiameter computes correctly', async () => {
    const store = createVuexStore();
    let config = JSON.parse('{"name": "spin30", "version": "2.0", "date": 1718893734, "aud": "https://app.practable.io/ed0/spinner-default-3.0", "images": [], "parameters": {"for": "ui", "are": [{"k": "title", "v": "Spinning Disk", "m": "68g", "d": "40mm", "t": "20mm"}]}}')
    store.dispatch('setConfigJSON', config);
    
    const wrapper = mount(ShowHardwareConfigButton, {
      global:{
        plugins: [store]
      }
    });

    await wrapper.get('#config-toolbar-button').trigger('click');
    expect(wrapper.find('#modal-show').text()).toContain('40mm');
  
  
  })

  test('getSpinnerThickness computes correctly', async () => {
    const store = createVuexStore();
    let config = JSON.parse('{"name": "spin30", "version": "2.0", "date": 1718893734, "aud": "https://app.practable.io/ed0/spinner-default-3.0", "images": [], "parameters": {"for": "ui", "are": [{"k": "title", "v": "Spinning Disk", "m": "68g", "d": "40mm", "t": "20mm"}]}}')
    store.dispatch('setConfigJSON', config);
    
    const wrapper = mount(ShowHardwareConfigButton, {
      global:{
        plugins: [store]
      }
    });

    await wrapper.get('#config-toolbar-button').trigger('click');
    expect(wrapper.find('#modal-show').text()).toContain('20mm');
  
  
  })

  test('No config file displays Disk mass unavailable', async () => {
    const store = createVuexStore();

    const wrapper = mount(ShowHardwareConfigButton, {
      global:{
        plugins: [store]
      }
    });

    await wrapper.get('#config-toolbar-button').trigger('click');
    expect(wrapper.find('#modal-show').text()).toContain('Disk mass unavailable');
  
  
  })

  test('Config file exists but no parameters available', async () => {
    const store = createVuexStore();
    let config = JSON.parse('{"name": "spin30", "version": "2.0", "date": 1718893734, "aud": "https://app.practable.io/ed0/spinner-default-3.0", "images": []}')
    store.dispatch('setConfigJSON', config);
    const wrapper = mount(ShowHardwareConfigButton, {
      global:{
        plugins: [store]
      }
    });

    await wrapper.get('#config-toolbar-button').trigger('click');
    expect(wrapper.find('#modal-show').text()).toContain('Disk mass unavailable');
  
  
  })

  


  

})