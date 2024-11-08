# Featrack SDK

## Overview
The Featrack SDK is a powerful tool designed to help developers integrate feature tracking capabilities into their applications. It provides a simple and efficient way to manage and monitor feature usage, enabling data-driven decisions for feature development and deployment.

## Features
- **Easy Integration**: Quickly add feature tracking to your application with minimal setup.
- **Real-time Analytics**: Monitor feature usage in real-time to gain insights into user behavior.
- **Customizable**: Tailor the SDK to fit your specific needs with flexible configuration options.
- **Scalable**: Designed to handle applications of all sizes, from small projects to large-scale deployments.

## Installation
To install the Featrack SDK, use the following command:

```bash
npm install featrack-sdk
```

## Usage
Here is a basic example of how to use the Featrack SDK in your project:

```javascript
// With commonJS
const {FT} = require('featrack-sdk');

// With ES6 modules
import {FT} from 'featrack-sdk';

// For the js module only

import {FT} from 'featrack-sdk/js';

// Initialize the SDK
const ft = FT('YOUR_API_KEY', 'YOUR_APPLICATION_SLUG', {
    errorMode: 'throw', // Optional (default: 'warn'),
    ftApiUrl: 'https://api.featrack.io/api/', // Optional
});

// Create a customer
ft.customers.create('customer_unique_id', {
    customerName: 'John Doe', // Optional
});

// Use a specific customer unique id for all tracking
ft.customers.identify('customer_unique_id');

// Track a feature
featrack.track('feature_slug', {
    featureName: 'Feature Name', // Optional
    featureDescription: 'Feature Description', // Optional
    featureEmoji: '🚀', // Optional
    customerName: 'John Doe', // Optional
    createdAt: '2022-01-01T00:00:00Z', // Optional (default: current date/time)
});

// Start a session
ft.sessions.start({
    customerUniqueId: 'customer_unique_id'
}).then(session => {
    console.log('Session started:', session.sessionId);
});

// Set time spent in a session
ft.sessions.setTimeSpent({
    timeSpentMs: 5000 // Time spent in milliseconds
}).then(response => {
    console.log('Time spent set:', response.success);
});

// End a session
ft.sessions.end({
    timeSpentMs: 10000 // Total time spent in milliseconds
}).then(response => {
    console.log('Session ended:', response.success);
});
```

## Configuration
You can configure the SDK with various options to suit your needs:

```javascript
const featrack = new Featrack({
  apiKey: 'YOUR_API_KEY',
  environment: 'production',
  debug: true
})
```

<!-- ## Documentation
For detailed documentation and advanced usage, please visit our [official documentation](https://example.com/docs). -->

<!-- ## Contributing
We welcome contributions! Please see our [contributing guidelines](https://example.com/contributing) for more information. -->

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
If you have any questions or need support, please contact me at contact@featrack.io .
