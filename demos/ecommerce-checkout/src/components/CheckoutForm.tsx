import { VoiceInput, VoiceSelect } from '@speechly/react-voice-forms';
import countries from '../countries.json';

const CheckoutForm = () => {

  const onFocusElement = (el: HTMLElement) => {
    el.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <form>
      <h2>Speechly Express Checkout</h2>
      <h3>Recipient Details</h3>
      <div className="group">
        <VoiceInput label="Name" changeOnEntityType="name" changeOnIntent="fill" onVoiceFocus={onFocusElement}/>
        <VoiceInput label="Phone" changeOnEntityType="phone" changeOnIntent="fill" onVoiceFocus={onFocusElement} />
        <VoiceInput label="Email" changeOnEntityType="email" changeOnIntent="fill" onVoiceFocus={onFocusElement} />
      </div>
      <h3 className='headerTopGap'>Shipping Details</h3>
      <div className="group">
        <VoiceInput label="Address" changeOnEntityType="address" changeOnIntent="fill" onVoiceFocus={onFocusElement} />
        <VoiceInput label="City" changeOnEntityType="city" changeOnIntent="fill" onVoiceFocus={onFocusElement} />
        <div className='multiFieldRow'>
          <VoiceInput label="Zip" changeOnEntityType="zip" changeOnIntent="fill" onVoiceFocus={onFocusElement} />
          <VoiceSelect label="Country" changeOnIntent="fill" changeOnEntityType='country' defaultValue="Finland" options={countries} onVoiceFocus={onFocusElement}/>
        </div>
      </div>
      <h3 className='headerTopGap'>Payment Details</h3>
      <div className="group">
        <VoiceInput label="Name on card" changeOnEntityType="card_name" changeOnIntent="fill" onVoiceFocus={onFocusElement}/>
        <VoiceInput label="Credit card number" changeOnEntityType="card_number" changeOnIntent="fill" onVoiceFocus={onFocusElement} />
        <div className='multiFieldRow'>
          <VoiceInput label="CVC" changeOnEntityType="card_cvc" changeOnIntent="fill" onVoiceFocus={onFocusElement} />
          <VoiceInput label="Expiration date" changeOnEntityType="card_expiration" changeOnIntent="fill" onVoiceFocus={onFocusElement} />
        </div>
      </div>
      <div className="group headerTopGap">
        <button name='place_order'
          onClick={() => alert(`
          Thank you for trying out Speechly Express Checkout demo!
          
          Please visit speechly.com for more information.`)}>
          Place the order
        </button>
      </div>
    </form>
  )
}

export default CheckoutForm;
