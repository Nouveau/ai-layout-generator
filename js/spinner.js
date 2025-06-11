/**
 * @file
 * Attaches the behavior for the AI Layout Builder spinner with an artificial delay.
 */
(function ($, Drupal) {

  'use strict';

  /**
   * Attaches the spinner behavior to the node form's submit event.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   * Attaches the spinner trigger and delay to the form submission.
   */
  Drupal.behaviors.aiLayoutBuilderSpinner = {
    attach: function (context, settings) {
      console.log('AI Layout Builder Spinner: attach behavior initiated.');

      const $form = $('form.node-form', context);

      // Only attach the handlers once to the form.
      if ($form.length && !$form.data('ai-spinner-handler-attached')) {
        console.log('AI Layout Builder Spinner: Found node form and attaching handlers.');

        // As a safeguard, ensure the spinner is explicitly hidden when this behavior attaches.
        $('#ai-layout-builder-spinner-overlay').hide();

        let clickedButton = null;

        // Find the target buttons within the form.
        const $buttons = $('#edit-submit, #edit-layout-builder-save-and-edit-layout', $form);

        if ($buttons.length) {
          console.log('AI Layout Builder Spinner: Found target buttons:', $buttons);
        } else {
          console.log('AI Layout Builder Spinner: Could not find target buttons (#edit-submit or #edit-layout-builder-save-and-edit-layout).');
        }

        // Use 'mousedown' to be sure we capture the button before the submit event fires.
        $buttons.on('mousedown', function() {
          console.log('AI Layout Builder Spinner: Mousedown event on a target button.', this);
          clickedButton = this;
        });

        $form.on('submit', function(e) {
          console.log('AI Layout Builder Spinner: Form submit event triggered.');

          // Check if the submission was initiated by one of our target buttons
          // and if our processing has not already started.
          if (clickedButton && !$form.data('ai-spinner-processing')) {
            console.log('AI Layout Builder Spinner: Intercepting submission. Preventing default action.');

            // Stop the form submission.
            e.preventDefault();
            // Set a flag to prevent this logic from running again on the programmatic submit.
            $form.data('ai-spinner-processing', true);

            // Show the spinner overlay. Using .css() for more direct control.
            console.log('AI Layout Builder Spinner: Showing spinner overlay.');
            $('#ai-layout-builder-spinner-overlay').css('display', 'flex');

            // Simulate the API call delay.
            console.log('AI Layout Builder Spinner: Starting 3-second delay.');
            setTimeout(function() {
              console.log('AI Layout Builder Spinner: Delay finished. Submitting form programmatically.');

              // In order for the server to know which button was "clicked",
              // we append a hidden input with that button's name and value
              // before submitting the form.
              if ($(clickedButton).attr('name')) {
                $('<input />').attr('type', 'hidden')
                  .attr('name', $(clickedButton).attr('name'))
                  .attr('value', $(clickedButton).attr('value'))
                  .appendTo($form);
              }

              // Now submit the form. The 'ai-spinner-processing' flag will prevent
              // this from being intercepted again.
              $form.get(0).submit();
            }, 3000); // 3-second delay.
          } else {
            console.log('AI Layout Builder Spinner: Allowing normal form submission.');
          }
        });

        // Mark the form so we don't attach the handler multiple times.
        $form.data('ai-spinner-handler-attached', true);
      }
    }
  };

})(jQuery, Drupal);
