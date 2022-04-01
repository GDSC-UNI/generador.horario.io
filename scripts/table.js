$(document).ready(function() {
    $('#myTable').DataTable( {
        "ajax": '../JSON/horarios.json',
        searching: false,
        paging: false,
        info: false, 
        columnDefs: [ {
            defaultContent: '',
            orderable: false,
            className: 'select-checkbox',
            targets: 8
        } ],
        select: {
            style: 'multi',
        },
        order: [[1, 'asc' ]],
        lengthChange: false,
        rowsGroup: [0, 1, 2, 8]
    } );
} );