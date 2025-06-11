var initCharts = function() {
    $('canvas[class="chart"]').each(function() {
        var name = $(this).attr('id'),
            canvas = document.getElementById(name),
            ctx = null,
            path = '',
            json = {},
            chart = null;

        if (!canvas) {
            return;
        }

        ctx = canvas.getContext('2d');
        path = '../charts/' + name + '.json';

        $.getJSON(path, function(data) {
            json = data;
            chart = new Chart(ctx, json);
        });

        $('a[data-toggle="tab"]').on('shown.bs.tab', function() {
            chart.destroy();
            chart = new Chart(ctx, json);
        });
    });
};
