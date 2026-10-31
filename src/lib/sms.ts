/**
 * BulkSMSBD SMS Gateway Utility
 * Endpoint: http://bulksmsbd.net/api/smsapi
 */

interface SendSmsOptions {
  number: string;
  message: string;
}

interface SmsResponse {
  success: boolean;
  code?: number | string;
  message?: string;
  raw?: any;
}

export async function sendSms({ number, message }: SendSmsOptions): Promise<SmsResponse> {
  const apiKey = process.env.BULKSMS_API_KEY || 'UivVa73bujGUIqNCr6s6';
  const senderId = process.env.BULKSMS_SENDER_ID || '8809617625025';

  // Normalize phone number to 8801XXXXXXXXX format
  let cleanNumber = number.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('01')) {
    cleanNumber = `88${cleanNumber}`;
  } else if (cleanNumber.startsWith('+8801')) {
    cleanNumber = cleanNumber.replace('+', '');
  }

  const url = `http://bulksmsbd.net/api/smsapi?api_key=${encodeURIComponent(
    apiKey
  )}&type=text&number=${encodeURIComponent(cleanNumber)}&senderid=${encodeURIComponent(
    senderId
  )}&message=${encodeURIComponent(message)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*'
      }
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text };
    }

    // response_code 202 means SMS Submitted Successfully
    const isSuccess = data?.response_code === 202 || data?.response_code === '202' || text.includes('202');

    return {
      success: isSuccess,
      code: data?.response_code,
      message: data?.success_message || data?.error_message || text,
      raw: data
    };
  } catch (err: any) {
    console.error('sendSms error:', err);
    return {
      success: false,
      message: err.message || 'SMS পাঠাতে ব্যর্থ হয়েছে'
    };
  }
}

