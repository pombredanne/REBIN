class TestClass
  def self.test_function(some_var)
    puts "I got the following variable: #{some_var}"
  end
end

TestClass.test_function(ARGV[0])
