import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import GraphOutput from '../../src/components/GraphOutput.vue';
import { createStore } from 'vuex';

import uiStore from '../../src/modules/uiStore.js'
import dataStore from '../../src/modules/dataStore.js'

const createVuexStore = () => 

    createStore({
        modules:{
            ui: uiStore,
            data: dataStore
        }
    });
    
describe('GraphOutput.vue', () => {

  test('Chart exists on mount', async () => {
    const store = createVuexStore();
    
    const wrapper = mount(GraphOutput, {
      global:{
        plugins: [store]
      }
    });


    expect(wrapper.find('#graph-canvas').toBeTruthy())
  
  })

  

  
  

})