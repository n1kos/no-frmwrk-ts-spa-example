export class ButtonTop {
  mybutton: HTMLButtonElement //  //document.getElementById("myBtn");

  constructor(_mybtn: HTMLButtonElement) {
    this.mybutton = _mybtn
  }

  scrollFunction = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      this.mybutton.style.display = 'block'
    } else {
      this.mybutton.style.display = 'none'
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction = () => {
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
  }
}
