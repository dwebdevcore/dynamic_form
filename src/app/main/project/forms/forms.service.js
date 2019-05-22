(function () {
    'use-strict'

    angular
        .module('app.project.forms')
        .factory('formsService', formsService);

    function formsService() {

        const storageKey = 'dynamic-forms-configurations';

        var forms = [];

        var formsInStorage = localStorage.getItem(storageKey);

        if (formsInStorage) {
            forms = JSON.parse(formsInStorage);
        } else

            for (var i = 0; i < 29; i++) {
                forms.push({
                    id: i + 1,
                    name: `Configuration ${i+1}`,
                    url: 'https://google.com'
                });
            }

        function getForms() {
            return forms;
        }

        function addForm(form) {
            form.url = `${location.hostname}/${uuidv4()}`;
            form.id = forms.length + 1;
            forms.push(form);

            localStorage.setItem(storageKey, JSON.stringify(forms));
            return form;
        }

        function find(id) {
            return forms.find(t => t.id == id);
        }

        var service = {
            getForms: getForms,
            addForm: addForm,
            find: find
        }

        return service;

        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }
})();