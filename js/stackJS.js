$(document).ready(function() {

  // Efeito do label
  $('.form_campos').on('focus blur', function(e) {
    $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    $(this).parents('.form-group').toggleClass('animate', (e.type === 'focus'));
  }).trigger('blur');
  $('.select').on('focus blur', function(e) {
    $(this).parents('.form-group-select').toggleClass('focused', (e.type === 'focus' || this.value !== ''));
    $(this).parents('.form-group-select').toggleClass('animate', (e.type === 'focus'));
  }).trigger('blur');

  // Auto focus
  $(".autofocus").trigger('focus');

  // Verifica se o input esta disabilitado
  $('input:disabled').addClass('form_disabled');

  // Verifica se o select esta disabilitado
  $('select:disabled').addClass('select_disabled');

  // Converte minusculas em maiusculas
  $('input').not('[name="link"]').on('input', function() {

    // Armazena posição corrente do cursor
    var start = this.selectionStart,
      end = this.selectionEnd;
    this.value = this.value.toUpperCase();

    // Restaura posição armazenada anteriormente.
    this.setSelectionRange(start, end);
  });
});
