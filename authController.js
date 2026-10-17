const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log('SUPABASE URL:', process.env.SUPABASE_URL);
console.log('SUPABASE KEY EXISTS:', !!process.env.SUPABASE_KEY);

// ================= SIGNUP =================
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Signup Request:', { name, email });

    // Check existing user
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('Find User Error:', findError);

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered!'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword
        }
      ])
      .select();

    console.log('Insert Error:', error);

    if (error) {
      return res.status(500).json({
        message: error.message
      });
    }

    const user = data[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log('SIGNUP ERROR:', error);

    res.status(500).json({
      message: error.message || 'Server error'
    });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('LOGIN ERROR:', error);

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password!'
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password!'
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log('LOGIN CATCH ERROR:', error);

    res.status(500).json({
      message: error.message || 'Server error'
    });
  }
};

module.exports = { signup, login };