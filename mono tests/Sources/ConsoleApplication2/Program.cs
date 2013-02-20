using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConsoleApplication2
{
    using System.IO;

    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length == 2)
            {
                int count = 0;
                Int32.TryParse(args[1], out count);

                if (count > 0) for (int i = 0; i < count; i++) Console.WriteLine(args[0]);
                else WriteInstruction();
            }
            else WriteInstruction();

            //Console.ReadKey();
        }

        static void WriteInstruction()
        {
            Console.WriteLine(string.Format("Usage: {0} $text$ $repeat_count$", Path.GetFileName(Environment.GetCommandLineArgs()[0])));
        }
    }
}
