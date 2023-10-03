$(document).on('click', '.checkbox', function() {
    // Find the next sibling element and then select the <p> element within it
    const $task = $(this).siblings();
    console.log($task);
    // Toggle the "strike" class on the <p> element
    $task.toggleClass('strike');
});