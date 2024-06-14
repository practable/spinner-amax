//Vue3 updated
//Orthogonality

<template>
<div class="container-fluid m-2 practable-component table">
    <div class="row">

        <table v-for="table in tableData">
            <thead class='table-head'>
                <tr>
                    <th scope="col">Dataset</th>
                    <th scope="col">Time[s]</th>
                    <th scope="col">Angle[rad]</th>
                    <th scope="col">Angular Velocity[rad/s]</th>
                    <th scope="col">Command</th>
                    <th scope="col">Drive</th>
                    <th scope="col">Error</th>
                </tr>
            </thead>
            <tr v-for="row in table" :id="row.id" :key="row.id" v-bind:class="[row.id == selected_row_id ? 'selected-row' : '']" @click="changeSelected(row.id)">
                <td>{{row.set}}</td>
                <td>{{row.t.toFixed(2)}}</td>
                <td>{{row.theta}}</td>
                <td>{{row.omega}}</td>
                <td>{{row.command}}</td>
                <td>{{row.drive}}</td>
                <td>{{row.error}}</td>
            </tr>

            <tfoot class="table-head">
                <td><p></p></td>
            </tfoot>
                                
        </table> 

    
        <!-- If there is no current data stored then just display a table heading -->
        <table v-if="tableData.length == 0" class='table' id='tableData'>
            <tr>
                <th scope="col">Dataset</th>
                    <th scope="col">Time[s]</th>
                    <th scope="col">Angle[rad]</th>
                    <th scope="col">Angular Velocity[rad/s]</th>
                    <th scope="col">Command</th>
                    <th scope="col">Drive</th>
                    <th scope="col">Error</th>
            </tr>
            <tr>
                <td :colspan="6"> Data will display once recording complete.</td>
            </tr>
        </table>

    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'TableOutput',
    props:[
      'tableHeadings', 'selected_point'
    ],
    data(){
        return{
            tableData: [],
            searchData:[],
            search_field:"",
            selected_row_id: "0",
        }
    },
    created(){
        
    },
    mounted() {
        this.updateTable();
    },
    computed:{
        ...mapGetters([
            'getIsRecording',
            'getData',
            'getDataSets'
        ]),
    },
    watch:{
        //to clear data table on reset.
        getData(data){
            if(data.length == 0){
                this.updateTable();
            }
        },
        //to update table once recording complete
        getIsRecording(now, prev){
            if(!now && prev){
                this.updateTable();
            }
        },
        selected_point(id){
            this.changeSelected(id);
        }
    },
    methods: {
        updateTable(){
            //this.tableData = [...this.getData];     //get a clone of the data, not set tableData to the getData getter
            console.log('updating table')
            this.tableData = [...this.getDataSets];
        },
        changeSelected(id){
            this.selected_row_id = id;
            var elmnt = document.getElementById(id);
            elmnt.scrollIntoView(false); 
        },
      },
      
}
</script>

<style scoped>

.selected-row{
    background-color: red;
    color: white;
}
</style>
