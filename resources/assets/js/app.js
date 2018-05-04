require('./bootstrap');

// Dependencies
window.Vue = require('vue')
import FullCalendar from 'vue-full-calendar'
import 'fullcalendar-scheduler'
import ToggleButton from 'vue-js-toggle-button'
const moment = require('moment');

// Stylesheets
import 'fullcalendar/dist/fullcalendar.min.css'
import 'fullcalendar-scheduler/dist/scheduler.min.css'
import 'toastr/build/toastr.min.css';

// Vue.component('example-component', require('./components/ExampleComponent.vue'))
Vue.component('modal', require('./components/Modal.vue'))
Vue.component('apptmodal', require('./components/ApptModal.vue'))
Vue.component('viewmodal', require('./components/ViewModal.vue'))
Vue.use(FullCalendar)
Vue.use(ToggleButton)

const app = new Vue({
	el: '#app',

	data() {
		var self = this;
		return {
			showModal: false,
			showApptModal: false,
			showViewModal: false,
			selectedTitle: '',
			selectedDescription: '',
			selectedResourceId: '',
			selectedStart: '',
			selectedEnd: '',
			allResourceInfo: {},
			eventSources: [
			{
				events(start, end, timezone, callback) {
					window.axios.post('/appointments', {
						startDate: start,
						endDate: end
					})
					.then((response) => {
						callback(response.data)
					})
				}
			}],
			config: {
				schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
				resourceLabelText: "Rooms",
				resources: function(callback, start, end, timezone) {
					window.axios.get('/resources')
						.then((response) => {
							self.allResourceInfo = response.data
							callback(response.data)
						}
					)
				},
				customButtons: {
					promptResource: {
						text: 'Add Room',
						click: function(event) {
							self.toggleModal();
						}
					},
					addAppt: {
						text: 'Add Appt',
						click: function(event) {
							self.toggleApptModal();
						}
					}
				},
				defaultView: "timelineDay",
				header: {
					left: "promptResource addAppt today prev,next",
					center: "title",
					right: "agendaDay,timelineDay,agendaWeek,month"
				},
				select: function (start, end, jsEvent, view, resource) {

					self.selectedStart = start.format()
					self.selectedEnd = end.format()
					self.selectedResourceId = resource.id
					console.log(self.selectedStart, self.selectedEnd, start, end, resource)
					self.toggleApptModal();

				},
			}
		}
	},
	methods: {
		toggleModal() {

			this.showModal = !this.showModal

		},
		toggleApptModal() {

			this.showApptModal = !this.showApptModal

		},
		broadcastResource(resource) {
			
		},
		refreshEvents() {

			$('#calendar').fullCalendar('refetchResources');
			$('#calendar').fullCalendar('refetchEvents');

		},

		removeEvent() {

			this.$refs.calendar.$emit('remove-event', this.selected)
			this.selected = {};

		},

		eventSelected(event) {

			this.selected = event

		},

		eventCreated(...test) {

			console.log(test)

		},

	},

	computed: {
		
	},

	mounted() {
		console.log(this)
		console.log(this.$refs)
	}

});