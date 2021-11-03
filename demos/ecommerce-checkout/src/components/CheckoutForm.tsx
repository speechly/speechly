import { VoiceInput, VoiceSelect } from '@speechly/react-voice-forms';
import countries from '../countries.json';

const CheckoutForm = () => {
  return (
    <form>
      <h2>Speechly Express Checkout</h2>
      <h3>Recipient Details</h3>
      <div className="group">
        <VoiceInput label="Name" changeOnEntityType="name" changeOnIntent="fill" />
        <VoiceInput label="Phone" changeOnEntityType="phone" changeOnIntent="fill" />
        <VoiceInput label="Email" changeOnEntityType="email" changeOnIntent="fill" />
      </div>
      <h3 className='headerTopGap'>Shipping Details</h3>
      <div className="group">
        <VoiceInput label="Address" changeOnEntityType="address" changeOnIntent="fill" />
        <VoiceInput label="City" changeOnEntityType="city" changeOnIntent="fill" />
        <div className='multiFieldRow'>
          <VoiceInput label="Zip" changeOnEntityType="zip" changeOnIntent="fill" />
          <VoiceSelect label="Country" changeOnIntent="fill" changeOnEntityType='country' defaultValue="Finland" options={countries} />
        </div>
      </div>
      <h3 className='headerTopGap'>Payment Details</h3>
      <div className="group">
        <VoiceInput label="Name on card" changeOnEntityType="card_name" changeOnIntent="fill" />
        <VoiceInput label="Credit card number" changeOnEntityType="card_number" changeOnIntent="fill" />
        <div className='multiFieldRow'>
          <VoiceInput label="CVC" changeOnEntityType="card_cvc" changeOnIntent="fill" />
          <VoiceInput label="Expiration date" changeOnEntityType="card_expiration" changeOnIntent="fill" />
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
